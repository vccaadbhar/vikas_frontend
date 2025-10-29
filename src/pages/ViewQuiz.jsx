import React, { useEffect, useState } from "react";
import { listQuizzes, exportQuizCSV } from "../services/quizApi";

export default function ViewQuiz() {
  const [filters, setFilters] = useState({ className: "", subject: "", topic: "" });
  const [quizzes, setQuizzes] = useState([]);
  const [msg, setMsg] = useState("");

  const loadQuizzes = async () => {
    try {
      const res = await listQuizzes(filters);
      setQuizzes(res);
    } catch (e) {
      setMsg("❌ " + e.message);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const downloadCSV = async (id) => {
    try {
      const blob = await exportQuizCSV(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quiz_${id}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setMsg("❌ Export failed");
    }
  };

  // ✅ Import CSV handler
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:4000/api/quizzes/import", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Import failed");
      const data = await res.json();
      setMsg("✅ Quiz imported: " + data._id);
      loadQuizzes(); // reload after import
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">View Quizzes</h2>

      {/* Filters */}
      <div className="flex gap-2">
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
        <input
          placeholder="Topic"
          className="border p-2"
          value={filters.topic}
          onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
        />
        <button
          onClick={loadQuizzes}
          className="px-3 py-2 bg-gray-700 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* CSV Import */}
      <div className="border p-3 rounded">
        <h3 className="font-medium mb-2">Import Quiz from CSV</h3>
        <input type="file" accept=".csv" onChange={handleImport} />
        <p className="text-sm text-gray-500 mt-1">
          Format: Question, OptionA-F, Correct (A-F), Explanation, TimeLimitSeconds
        </p>
      </div>

      {msg && <p>{msg}</p>}

      {/* Quiz List */}
      <ul className="space-y-2">
        {quizzes.map((quiz) => (
          <li
            key={quiz._id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{quiz.name}</div>
              <div className="text-sm text-gray-500">
                {quiz.className} | {quiz.subject} | {quiz.topic}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => downloadCSV(quiz._id)}
                className="px-2 py-1 border rounded"
              >
                Export CSV
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
