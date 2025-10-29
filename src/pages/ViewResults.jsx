import React, { useState, useEffect } from "react";
import { getResults } from "../services/quizApi";

export default function ViewResults({ role, studentName }) {
  const [filters, setFilters] = useState({
    className: "",
    subject: "",
    studentName: studentName || "",
  });
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      const data = await getResults(role, filters.studentName);
      // ✅ Apply frontend filters (className, subject)
      let filtered = data;
      if (filters.className) {
        filtered = filtered.filter((r) => r.className === filters.className);
      }
      if (filters.subject) {
        filtered = filtered.filter((r) => r.subject === filters.subject);
      }
      setResults(filtered);
    } catch (err) {
      setMsg("❌ Failed to load results: " + err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Quiz Results</h2>
      {msg && <p>{msg}</p>}

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Class"
          className="border p-2"
          value={filters.className}
          onChange={(e) => setFilters({ ...filters, className: e.target.value })}
        />
        <input
          placeholder="Subject"
          className="border p-2"
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
        />
        {(role === "admin" || role === "teacher" || role === "staff") && (
          <input
            placeholder="Student Name"
            className="border p-2"
            value={filters.studentName}
            onChange={(e) =>
              setFilters({ ...filters, studentName: e.target.value })
            }
          />
        )}
        <button
          onClick={load}
          className="px-3 py-2 bg-gray-700 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        results.map((r) => (
          <div key={r._id} className="border rounded p-4 mb-4">
            <h3 className="font-medium">
              Quiz: {r.quizId?.name || "Quiz"} | Class: {r.className} | Subject:{" "}
              {r.subject}
            </h3>
            <p>
              Student: {r.studentName} | Score: {r.score}/{r.total}
            </p>
            <ul className="list-disc pl-5 mt-2">
              {r.answers.map((a, i) => (
                <li key={i}>
                  {a.isCorrect ? "✅" : "❌"} {a.question} —{" "}
                  {a.selected || "No Answer"} (⏱ {a.timeTaken || 0}s)
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
