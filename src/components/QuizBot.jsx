import React, { useState, useEffect } from "react";
import { getQuestions, attemptQuestion } from "../services/quiz";

function QuizBot() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    getQuestions().then(setQuestions);
  }, []);

  const handleAnswer = async (qid, optionId) => {
    const res = await attemptQuestion(qid, optionId);
    setResult(res.correct ? "✅ Correct!" : "❌ Wrong!");
  };

  if (questions.length === 0) return <p>No quiz questions yet.</p>;

  const q = questions[current];

  return (
    <div style={{ padding: 20 }}>
      <h3>📝 {q.question}</h3>
      <ul>
        {q.options.map((opt) => (
          <li key={opt._id}>
            <button onClick={() => handleAnswer(q._id, opt._id)}>
              {opt.text}
            </button>
          </li>
        ))}
      </ul>
      {result && <p>{result}</p>}
      <button
        onClick={() => {
          setCurrent((c) => (c + 1) % questions.length);
          setResult(null);
        }}
      >
        Next ➡
      </button>
    </div>
  );
}

export default QuizBot;
