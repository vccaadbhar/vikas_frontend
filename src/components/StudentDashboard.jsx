// src/components/StudentDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TakeQuiz from "./TakeQuiz";

const API = "http://localhost:4000";

function safeArray(x) {
  return Array.isArray(x) ? x : [];
}

function StudentDashboard({ user }) {
  // ---- state ----
  const [student, setStudent] = useState(user || null);
  const [profile, setProfile] = useState(null);
  const [section, setSection] = useState("profile");

  // tests
  const [testsUpcoming, setTestsUpcoming] = useState([]);
  const [testsCompleted, setTestsCompleted] = useState([]);
  const [testsTab, setTestsTab] = useState("upcoming"); // 'upcoming' | 'completed'
  const [selectedTest, setSelectedTest] = useState(null);

  // fees/classes/notices (kept as-is, just safer)
  const [fees, setFees] = useState([]);
  const [classes, setClasses] = useState({ recorded: [], online: [] });
  const [notices, setNotices] = useState([]);

  // token
  const token = useMemo(
    () =>
      localStorage.getItem("token") ||
      localStorage.getItem("studentToken") ||
      "",
    []
  );

  // ---- boot: ensure student exists ----
  useEffect(() => {
    if (!student) {
      const raw =
        localStorage.getItem("user") || localStorage.getItem("student");
      if (raw) {
        try {
          setStudent(JSON.parse(raw));
        } catch {
          /* ignore */
        }
      }
    }
  }, [student]);

  // ---- fetch profile (fallback to localStorage) ----
  useEffect(() => {
    if (!student?._id) return;

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : undefined;

    // Try backend profile; fall back to student object
    axios
      .get(`${API}/api/auth/profile/${student._id}`, { headers })
      .then((res) => {
        if (res?.data) setProfile(res.data);
        else setProfile(student);
      })
      .catch(() => setProfile(student));
  }, [student, token]);

  // ---- fetch tests / fees / classes / notices ----
  useEffect(() => {
    if (!student?._id) return;

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : undefined;

    // Upcoming tests the student can attempt
    axios
      .get(`${API}/api/tests/student/${student._id}`, { headers })
      .then((res) => setTestsUpcoming(safeArray(res.data)))
      .catch(() => setTestsUpcoming([]));

    // Completed tests (attempts)
    axios
      .get(`${API}/api/tests/completed/${student._id}`, { headers })
      .then((res) => setTestsCompleted(safeArray(res.data)))
      .catch(() => setTestsCompleted([]));

    // Fees
    axios
      .get(`${API}/api/fees/student/${student._id}`, { headers })
      .then((res) => setFees(safeArray(res.data)))
      .catch(() => setFees([]));

    // Classes
    axios
      .get(`${API}/api/classes/student/${student._id}`, { headers })
      .then((res) =>
        setClasses({
          recorded: safeArray(res.data?.recorded),
          online: safeArray(res.data?.online),
        })
      )
      .catch(() => setClasses({ recorded: [], online: [] }));

    // Notices
    axios
      .get(`${API}/api/notifications/student/${student._id}`, { headers })
      .then((res) => {
        const d = res?.data;
        if (Array.isArray(d)) setNotices(d);
        else if (d) setNotices([d]);
        else setNotices([]);
      })
      .catch(() => setNotices([]));
  }, [student, token]);

  // ---- derived: average (completed) ----
  const avgProgress = useMemo(() => {
    const arr = safeArray(testsCompleted);
    if (!arr.length) return 0;
    const sum = arr.reduce((s, t) => s + (Number(t.score) || 0), 0);
    return (sum / arr.length).toFixed(2);
  }, [testsCompleted]);

  // ---- handle test start/view/reattempt ----
  const handleStartUpcoming = (t) => {
    // Upcoming test object is expected to already contain questions
    // If not, fetch quiz detail by id here (non-breaking)
    if (!t?.questions || !t.questions.length) {
      // attempt to fetch detail if API exists: /api/tests/:id
      axios
        .get(`${API}/api/tests/${t._id}`)
        .then((res) =>
          setSelectedTest(res?.data && res.data.questions ? res.data : t)
        )
        .catch(() => setSelectedTest(t));
    } else {
      setSelectedTest(t);
    }
  };

  const handleViewResult = (attempt) => {
    // If your TakeQuiz can render a read-only review, pass a flag
    setSelectedTest({ ...attempt, readOnly: true, isAttempt: true });
  };

  const handleReattempt = async (attempt) => {
    // Attempt references original quiz id by attempt.quizId or attempt.testId; try both
    const quizId = attempt.quizId || attempt.testId || attempt._id;
    if (!quizId) return;
    try {
      const res = await axios.get(`${API}/api/tests/${quizId}`);
      setSelectedTest(res?.data || attempt);
    } catch {
      setSelectedTest(attempt);
    }
  };

  // ---- render TakeQuiz when selected ----
  if (selectedTest) {
    // Minimal guard: show friendly back if quiz has no questions
    const hasQs = Array.isArray(selectedTest.questions) && selectedTest.questions.length > 0;
    if (!hasQs && !selectedTest.isAttempt) {
      return (
        <div className="p-6 text-center">
          <p className="text-red-500">⚠️ This quiz has no questions assigned.</p>
          <button
            onClick={() => setSelectedTest(null)}
            className="mt-3 px-3 py-1 bg-gray-300 rounded"
          >
            ← Back
          </button>
        </div>
      );
    }
    return (
      <TakeQuiz
        quiz={selectedTest}
        user={student || profile}
        onBack={() => setSelectedTest(null)}
        readOnly={!!selectedTest.readOnly}
      />
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-52 bg-gray-100 p-3 space-y-2">
        {["profile", "progress", "tests", "fee", "class", "notice"].map(
          (item) => (
            <button
              key={item}
              onClick={() => setSection(item)}
              className={`block w-full text-left px-2 py-1 rounded ${
                section === item ? "bg-blue-200" : "hover:bg-gray-200"
              }`}
            >
              {item === "profile"
                ? "👤 Profile"
                : item === "progress"
                ? "📊 Progress"
                : item === "tests"
                ? "📝 Tests"
                : item === "fee"
                ? "💰 Fee"
                : item === "class"
                ? "📚 Class"
                : "📢 Notices"}
            </button>
          )
        )}
      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Top bar: photo + welcome */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              src={
                profile?.photoUrl
                  ? `${API}${profile.photoUrl}`
                  : "https://via.placeholder.com/48x48.png?text=User"
              }
              alt="profile"
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
              <div className="text-2xl font-semibold">
                Welcome, {profile?.name || student?.name || "Student"}
              </div>
              <div className="text-gray-500 text-sm">
                {profile?.className ? `Class ${profile.className}${profile?.section ? ` - ${profile.section}` : ""}` : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Profile */}
        {section === "profile" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">👤 Profile</h2>
            {profile ? (
              <ul className="space-y-2">
                <li><b>Name:</b> {profile.name || "-"}</li>
                <li><b>Father Name:</b> {profile.fatherName || "-"}</li>
                <li><b>Mother Name:</b> {profile.motherName || "-"}</li>
                <li><b>DOB:</b> {profile.dob || "-"}</li>
                <li><b>Mobile:</b> {profile.mobile || (Array.isArray(profile.phone) ? profile.phone.join(", ") : "-")}</li>
                <li><b>Aadhaar:</b> {profile.aadhaarNumber || "-"}</li>
                <li><b>Class:</b> {profile.className || "-"}</li>
                <li><b>Section:</b> {profile.section || "-"}</li>
                {profile.email && <li><b>Email:</b> {profile.email}</li>}
                {profile.address && <li><b>Address:</b> {profile.address}</li>}
              </ul>
            ) : (
              <p>Loading profile…</p>
            )}
          </div>
        )}

        {/* Progress */}
        {section === "progress" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">📊 Progress</h2>
            <p>
              Average Score: <b>{avgProgress}%</b>
            </p>
          </div>
        )}

        {/* Tests */}
        {section === "tests" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">📝 Tests</h2>

            {/* Testbook-like tabs */}
            <div className="flex items-center gap-2 mb-4">
              <button
                className={`px-3 py-1 rounded ${
                  testsTab === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setTestsTab("upcoming")}
              >
                Upcoming
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  testsTab === "completed" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setTestsTab("completed")}
              >
                Completed
              </button>
            </div>

            {/* Upcoming list */}
            {testsTab === "upcoming" && (
              <ul className="list-disc ml-5 mb-4">
                {safeArray(testsUpcoming).length ? (
                  testsUpcoming.map((t) => (
                    <li key={t._id} className="mb-2">
                      <b>{t.title}</b> — {t.subject}{" "}
                      {t.duration ? `• ${t.duration} min` : ""}
                      <button
                        onClick={() => handleStartUpcoming(t)}
                        className="ml-3 px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        Start
                      </button>
                    </li>
                  ))
                ) : (
                  <li>No upcoming tests.</li>
                )}
              </ul>
            )}

            {/* Completed list */}
            {testsTab === "completed" && (
              <ul className="list-disc ml-5">
                {safeArray(testsCompleted).length ? (
                  testsCompleted.map((att) => (
                    <li key={att._id} className="mb-2">
                      <b>{att.title || att.quizTitle || "Test"}</b>{" "}
                      — Score: {Number(att.score ?? 0)}%
                      {att.accuracy != null ? ` • Accuracy: ${att.accuracy}%` : ""}
                      <button
                        onClick={() => handleViewResult(att)}
                        className="ml-3 px-2 py-1 bg-green-600 text-white rounded"
                      >
                        View Result
                      </button>
                      <button
                        onClick={() => handleReattempt(att)}
                        className="ml-2 px-2 py-1 bg-orange-500 text-white rounded"
                      >
                        Reattempt
                      </button>
                    </li>
                  ))
                ) : (
                  <li>No completed tests.</li>
                )}
              </ul>
            )}
          </div>
        )}

        {/* Fee */}
        {section === "fee" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">💰 Fees</h2>
            <ul>
              {safeArray(fees).length ? (
                fees.map((f) => (
                  <li key={f._id} className="mb-2">
                    <b>{f.month}</b> | Receipt: {f.receiptNumber} | Paid:{" "}
                    {f.createdAt
                      ? new Date(f.createdAt).toLocaleString()
                      : "-"}
                  </li>
                ))
              ) : (
                <li>No fee records.</li>
              )}
            </ul>
          </div>
        )}

        {/* Classes */}
        {section === "class" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">📚 Classes</h2>

            <h3 className="font-semibold">Recorded</h3>
            <ul className="list-disc ml-5 mb-4">
              {safeArray(classes.recorded).length ? (
                classes.recorded.map((c, idx) => (
                  <li key={`${c._id || idx}-rec`}>
                    {c.title} — {c.subject}{" "}
                    {c.link && (
                      <a
                        href={c.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Watch
                      </a>
                    )}
                  </li>
                ))
              ) : (
                <li>No recorded classes.</li>
              )}
            </ul>

            <h3 className="font-semibold">Online</h3>
            <ul className="list-disc ml-5">
              {safeArray(classes.online).length ? (
                classes.online.map((c, idx) => (
                  <li key={`${c._id || idx}-on`}>
                    {c.title} — {c.subject}{" "}
                    {c.link && (
                      <a
                        href={c.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-600 underline"
                      >
                        Join
                      </a>
                    )}
                  </li>
                ))
              ) : (
                <li>No online classes.</li>
              )}
            </ul>
          </div>
        )}

        {/* Notices */}
        {section === "notice" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">📢 Notices</h2>
            {safeArray(notices).length ? (
              <ul className="space-y-3">
                {notices.map((n) => (
                  <li
                    key={n._id || `${n.title}-${n.createdAt}-${Math.random()}`}
                    className="border rounded p-3 bg-white shadow-sm"
                  >
                    <h4 className="font-semibold">{n.title || "Notice"}</h4>
                    {n.message && <p className="text-sm">{n.message}</p>}
                    {n.fileUrl && (
                      <a
                        href={`${API}${n.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline block mt-1"
                      >
                        📎 View Attachment
                      </a>
                    )}
                    {n.link && (
                      <a
                        href={n.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-600 underline block mt-1"
                      >
                        🔗 Open Link
                      </a>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString()
                        : ""}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notices.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
