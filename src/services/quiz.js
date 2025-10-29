import axios from "axios";

const API = "http://localhost:4000/api/quiz";

export async function addQuestion(question, options) {
  const token = localStorage.getItem("token");
  const res = await axios.post(API, { question, options }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getQuestions() {
  const token = localStorage.getItem("token");
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function attemptQuestion(id, selectedOption) {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API}/${id}/attempt`, { selectedOption }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
