import React, { useState } from "react";
import { addQuestion } from "../services/quiz";

function QuizForm({ onBack }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ]);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addQuestion(question, options);
      alert("✅ Question added!");
      setQuestion("");
      setOptions([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ]);
    } catch (err) {
      alert("❌ Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onBack}>⬅ Back</button>
      <h2>Add Quiz Question</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <h4>Options</h4>
        {options.map((opt, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt.text}
              onChange={(e) => handleOptionChange(i, "text", e.target.value)}
              required
              style={{ width: "70%", padding: "5px" }}
            />
            <label style={{ marginLeft: "10px" }}>
              <input
                type="checkbox"
                checked={opt.isCorrect}
                onChange={(e) => handleOptionChange(i, "isCorrect", e.target.checked)}
              />
              Correct
            </label>
          </div>
        ))}

        <button type="button" onClick={addOption} style={{ marginBottom: "15px" }}>
          ➕ Add Option
        </button>

        <br />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {loading ? "Adding..." : "Add Question"}
        </button>
      </form>
    </div>
  );
}

export default QuizForm;
