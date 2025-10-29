import React, { useState } from "react";
import { createQuiz } from "../services/quizApi";

export default function MakeQuiz() {
  const [quizInfo, setQuizInfo] = useState({
    name: "",
    className: "",
    subject: "",
    topic: "",
    duration: 10,
  });

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState({
    text: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
    timeLimit: 30,
  });

  const [msg, setMsg] = useState("");

  // ✅ Add question manually
  const addQuestion = () => {
    if (!currentQ.text.trim()) {
      return alert("Enter question text");
    }
    const opts = currentQ.options
      .filter((o) => o.trim() !== "")
      .map((text, i) => ({
        text,
        isCorrect: i === Number(currentQ.correctIndex),
      }));

    setQuestions([
      ...questions,
      {
        text: currentQ.text,
        options: opts,
        explanation: currentQ.explanation,
        timeLimit: currentQ.timeLimit,
      },
    ]);

    setCurrentQ({
      text: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      explanation: "",
      timeLimit: 30,
    });
  };

  // ✅ Save quiz
  const saveQuiz = async () => {
    try {
      const payload = { ...quizInfo, questions };
      const res = await createQuiz(payload);
      setMsg("✅ Quiz created: " + res._id);
      setQuizInfo({ name: "", className: "", subject: "", topic: "", duration: 10 });
      setQuestions([]);
    } catch (err) {
      setMsg("❌ Error: " + err.message);
    }
  };

  // ✅ Import CSV
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", quizInfo.name || "Imported Quiz");
    formData.append("className", quizInfo.className);
    formData.append("subject", quizInfo.subject);
    formData.append("topic", quizInfo.topic);

    try {
      const res = await fetch("http://localhost:4000/api/quizzes/import", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Import failed");
      const data = await res.json();
      setMsg("✅ Quiz imported: " + data._id);
      setQuestions(data.questions || []);
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Make Quiz</h2>

      {/* Quiz Info */}
      <input
        placeholder="Quiz Name"
        className="border p-2 w-full"
        value={quizInfo.name}
        onChange={(e) => setQuizInfo({ ...quizInfo, name: e.target.value })}
      />
      <input
        placeholder="Class"
        className="border p-2 w-full"
        value={quizInfo.className}
        onChange={(e) => setQuizInfo({ ...quizInfo, className: e.target.value })}
      />
      <input
        placeholder="Subject"
        className="border p-2 w-full"
        value={quizInfo.subject}
        onChange={(e) => setQuizInfo({ ...quizInfo, subject: e.target.value })}
      />
      <input
        placeholder="Topic"
        className="border p-2 w-full"
        value={quizInfo.topic}
        onChange={(e) => setQuizInfo({ ...quizInfo, topic: e.target.value })}
      />
      <input
        type="number"
        placeholder="Quiz Duration (minutes)"
        className="border p-2 w-full"
        value={quizInfo.duration}
        onChange={(e) =>
          setQuizInfo({ ...quizInfo, duration: Number(e.target.value) })
        }
      />

      {/* Manual Add Question */}
      <div className="border p-4 rounded space-y-2">
        <h3 className="font-medium">Add Question</h3>
        <textarea
          className="border p-2 w-full"
          placeholder="Question text"
          value={currentQ.text}
          onChange={(e) => setCurrentQ({ ...currentQ, text: e.target.value })}
        />

        {currentQ.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name="correct"
              checked={currentQ.correctIndex === i}
              onChange={() => setCurrentQ({ ...currentQ, correctIndex: i })}
            />
            <input
              placeholder={`Option ${i + 1}`}
              className="border p-2 w-full"
              value={opt}
              onChange={(e) => {
                const newOpts = [...currentQ.options];
                newOpts[i] = e.target.value;
                setCurrentQ({ ...currentQ, options: newOpts });
              }}
            />
          </div>
        ))}

        <button
          onClick={() =>
            setCurrentQ({ ...currentQ, options: [...currentQ.options, ""] })
          }
          className="px-2 py-1 border rounded"
        >
          + Add Option
        </button>

        <textarea
          placeholder="Explanation (optional)"
          className="border p-2 w-full"
          value={currentQ.explanation}
          onChange={(e) =>
            setCurrentQ({ ...currentQ, explanation: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Time limit per question (seconds)"
          className="border p-2 w-full"
          value={currentQ.timeLimit}
          onChange={(e) =>
            setCurrentQ({ ...currentQ, timeLimit: Number(e.target.value) })
          }
        />

        <button
          onClick={addQuestion}
          className="px-3 py-2 bg-gray-600 text-white rounded"
        >
          + Add Question
        </button>
      </div>

      {/* CSV Import */}
      <div className="border p-4 rounded space-y-2">
        <h3 className="font-medium">Or Import from CSV</h3>
        <input type="file" accept=".csv" onChange={handleImport} />
        <p className="text-sm text-gray-500">
          Format: Question, OptionA-F, Correct (A-F), Explanation, TimeLimitSeconds
        </p>
      </div>

      {/* Question Preview */}
      <div>
        <h3 className="font-medium">Questions Added</h3>
        <ul className="list-disc pl-5">
          {questions.map((q, i) => (
            <li key={i}>
              {q.text} (Correct:{" "}
              {q.options.find((o) => o.isCorrect)?.text || "None"}) ⏱{" "}
              {q.timeLimit}s
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={saveQuiz}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save Quiz
      </button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
