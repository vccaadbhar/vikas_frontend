// src/pages/QuizDashboard.jsx
import React, { useState } from "react";
import axios from "axios";

export default function QuizDashboard() {
  const [quizName, setQuizName] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(10);
  const [msg, setMsg] = useState("");

  const handleCreateQuiz = async () => {
    try {
      const payload = {
        name: quizName,        // ✅ matches schema
        className: className,
        subject: subject,
        duration: duration,
        questionIds: []        // ✅ allowed to be empty
      };

      console.log("Creating quiz with payload:", payload);

      const res = await axios.post("http://localhost:4000/api/quizzes", payload);

      setMsg("✅ Quiz created successfully with ID: " + res.data._id);

      // Reset form
      setQuizName("");
      setClassName("");
      setSubject("");
      setDuration(10);
    } catch (err) {
      console.error("Quiz creation failed:", err.response?.data || err.message);
      setMsg("❌ Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Make Quiz</h2>

      <input
        type="text"
        className="border p-2 w-full rounded"
        placeholder="Quiz Name"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
        required
      />

      <input
        type="text"
        className="border p-2 w-full rounded"
        placeholder="Class"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />

      <input
        type="text"
        className="border p-2 w-full rounded"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <input
        type="number"
        className="border p-2 w-full rounded"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />

      <button
        onClick={handleCreateQuiz}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create Quiz
      </button>

      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}
