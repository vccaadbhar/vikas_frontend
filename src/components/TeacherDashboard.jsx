import React, { useEffect, useState } from "react";
import axios from "axios";
import SendNotification from "./SendNotification.jsx";

function TeacherDashboard({ teacher, onLogout }) {
  const [classes, setClasses] = useState([]);
  const [tests, setTests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tab, setTab] = useState("profile");
  const [notices, setNotices] = useState([]);
  const [showNoticeForm, setShowNoticeForm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!teacher?._id) return;

    axios.get(`http://localhost:4000/api/classes?teacher=${teacher._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setClasses(res.data));

    axios.get(`http://localhost:4000/api/tests?createdBy=${teacher._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setTests(res.data));

    axios.get(`http://localhost:4000/api/teachers/${teacher._id}/payments`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setPayments(res.data));

    // ✅ fetch notices
    axios.get("http://localhost:4000/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const all = res.data || [];
      const filtered = all.filter((n) => n.audience === "all" || n.audience === "teacher");
      setNotices(filtered);
    });
  }, [teacher, token]);

  if (!teacher) return <p>No teacher data.</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div style={{
        background: "#6b21a8",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
      }}>
        <h2>👨‍🏫 Welcome, {teacher.name}</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowNoticeForm(true)}
            style={{ background: "#f59e0b", color: "white", borderRadius: "5px", padding: "6px 12px" }}
          >
            📢 Create Notice
          </button>
          <button onClick={onLogout} style={{ background: "#dc2626", color: "white", borderRadius: "5px", padding: "6px 12px" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button onClick={() => setTab("profile")}>Profile</button>
        <button onClick={() => setTab("qualification")}>Qualification</button>
        <button onClick={() => setTab("bank")}>Bank</button>
        <button onClick={() => setTab("classes")}>Classes</button>
        <button onClick={() => setTab("tests")}>Tests</button>
        <button onClick={() => setTab("payments")}>Payments</button>
        <button onClick={() => setTab("notices")}>📢 Notices</button>
      </div>

      {tab === "profile" && (
        <div>
          <p><b>Name:</b> {teacher.name}</p>
          <p><b>Email:</b> {teacher.email}</p>
          <p><b>DOB:</b> {teacher.dob ? new Date(teacher.dob).toDateString() : "N/A"}</p>
          <p><b>Gender:</b> {teacher.gender}</p>
          <p><b>Address:</b> {teacher.address}</p>
          <p><b>Phone:</b> {Array.isArray(teacher.phone) ? teacher.phone.join(", ") : teacher.phone}</p>
          <p><b>Aadhaar:</b> {teacher.aadhaarNumber}</p>
        </div>
      )}

      {tab === "qualification" && (
        <div>
          <p><b>Graduation:</b> {teacher.graduationSubject} ({teacher.graduationYear})</p>
          <p><b>Post Graduation:</b> {teacher.postGraduationSubject} ({teacher.postGraduationYear})</p>
          <p><b>Special Course:</b> {teacher.specialCourse}</p>
        </div>
      )}

      {tab === "bank" && (
        <div>
          <p><b>Account No:</b> {teacher.bankDetails?.accountNumber || "N/A"}</p>
          <p><b>IFSC:</b> {teacher.bankDetails?.ifsc || "N/A"}</p>
          <p><b>Bank:</b> {teacher.bankDetails?.bankName} ({teacher.bankDetails?.branchName || "N/A"})</p>
        </div>
      )}

      {tab === "classes" && (
        <div>
          <h3>📚 Classes</h3>
          {classes.length === 0 ? <p>No classes yet.</p> : (
            <ul>{classes.map((c) => <li key={c._id}>{c.title} ({c.subject}) — {new Date(c.date).toDateString()}</li>)}</ul>
          )}
        </div>
      )}

      {tab === "tests" && (
        <div>
          <h3>📝 Tests</h3>
          {tests.length === 0 ? <p>No tests created.</p> : (
            <ul>{tests.map((t) => <li key={t._id}>{t.title} ({t.subject})</li>)}</ul>
          )}
        </div>
      )}

      {tab === "payments" && (
        <div>
          <h3>💰 Payments</h3>
          {payments.length === 0 ? <p>No payments yet.</p> : (
            <ul>{payments.map((p) => <li key={p._id}>{p.month} → ₹{p.amount} ({p.status})</li>)}</ul>
          )}
        </div>
      )}

      {tab === "notices" && (
        <div>
          <h3>📢 Notices</h3>
          {notices.length === 0 ? <p>No notices.</p> : (
            <ul>{notices.map((n) => (
              <li key={n._id} className="border p-2 mb-2 bg-white shadow-sm">
                <b>{n.title}</b><p>{n.message}</p>
              </li>
            ))}</ul>
          )}
        </div>
      )}

      {/* Notice Modal */}
      {showNoticeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <SendNotification onClose={() => setShowNoticeForm(false)} />
            <button onClick={() => setShowNoticeForm(false)} className="mt-3 px-4 py-2 bg-gray-500 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
