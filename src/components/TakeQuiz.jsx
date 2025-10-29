// src/components/TakeQuiz.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function TakeQuiz({ quiz, user, onBack }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.duration || 1800); // global timer in sec
  const [result, setResult] = useState(null);

  // Timer countdown
  useEffect(() => {
    if (!submitted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && !submitted) handleSubmit();
  }, [timeLeft, submitted]);

  const handleOption = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      const res = await axios.post(
        `http://localhost:4000/api/tests/${quiz._id}/attempt`,
        {
          studentId: user._id,
          answers,
        }
      );
      setResult(res.data);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  if (submitted && result) {
    const correct = result.correct || 0;
    const attempted = Object.keys(answers).length;
    const accuracy = attempted > 0 ? ((correct / attempted) * 100).toFixed(2) : 0;
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">📊 Test Result</h2>
        <p>Score: <b>{result.score}%</b></p>
        <p>Accuracy: <b>{accuracy}%</b></p>
        <h3 className="mt-4 font-semibold">Answer Review</h3>
        <ul className="list-disc ml-5">
          {quiz.questions.map((q, idx) => (
            <li key={idx} className="mb-2">
              <p><b>Q{idx + 1}:</b> {q.question}</p>
              <p>
                ✅ Correct Answer:{" "}
                {q.options.find((o) => o.isCorrect)?.text || "N/A"}
              </p>
              <p>
                📝 Your Answer:{" "}
                {answers[q._id]
                  ? q.options.find((o) => o._id === answers[q._id])?.text
                  : "Not Attempted"}
              </p>
            </li>
          ))}
        </ul>
        <button
          onClick={onBack}
          className="mt-4 px-3 py-1 bg-blue-500 text-white rounded"
        >
          ← Back
        </button>
      </div>
    );
  }

  const q = quiz.questions[current];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex h-screen">
      {/* Sidebar navigation */}
      <div className="w-20 bg-gray-100 p-2 overflow-y-auto">
        {quiz.questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`block w-full my-1 py-2 rounded ${
              current === idx
                ? "bg-blue-500 text-white"
                : answers[quiz.questions[idx]._id]
                ? "bg-green-200"
                : "bg-gray-200"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Main area */}
      <div className="flex-1 p-6">
        <div className="flex justify-between mb-4">
          <button
            onClick={onBack}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            ← Back
          </button>
          <div className="text-red-600 font-bold">
            ⏱ {mins}:{secs.toString().padStart(2, "0")}
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-3">
          Q{current + 1}. {q.question}
        </h2>
        <div className="space-y-2">
          {q.options.map((o) => (
            <div
              key={o._id}
              className={`p-2 border rounded cursor-pointer ${
                answers[q._id] === o._id
                  ? "bg-blue-200 border-blue-500"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleOption(q._id, o._id)}
            >
              {o.text}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <button
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            ← Prev
          </button>
          {current < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TakeQuiz;
