import axios from "axios";

const API_URL = import.meta?.env?.VITE_API_URL || "http://localhost:4000/api";

// 📌 List quizzes with filters
export const listQuizzes = async (params = {}) => {
  const res = await axios.get(`${API_URL}/quizzes`, { params });
  return res.data;
};

// 📌 Get quiz by ID
export const getQuiz = async (id) => {
  const res = await axios.get(`${API_URL}/quizzes/${id}`);
  return res.data;
};

// 📌 Create new quiz
export const createQuiz = async (payload) => {
  const res = await axios.post(`${API_URL}/quizzes`, payload);
  return res.data;
};

// 📌 Update quiz
export const updateQuiz = async (id, payload) => {
  const res = await axios.put(`${API_URL}/quizzes/${id}`, payload);
  return res.data;
};

// 📌 Export quiz as CSV
export const exportQuizCSV = async (id) => {
  const res = await axios.get(`${API_URL}/quizzes/${id}/export`, {
    responseType: "blob",
  });
  return res.data; // returns a blob
};

// 📌 Submit quiz attempt
export const submitAttempt = async (payload) => {
  const res = await axios.post(`${API_URL}/attempts`, payload);
  return res.data;
};

// 📌 Get leaderboard
export const getLeaderboard = async (quizId) => {
  const res = await axios.get(`${API_URL}/attempts/leaderboard/${quizId}`);
  return res.data;
};

// 📌 Get results (role-based)
export const getResults = async (role, studentName) => {
  const params = {};
  if (role) params.role = role;
  if (studentName) params.studentName = studentName;

  const res = await axios.get(`${API_URL}/attempts/results`, { params });
  return res.data;
};

// 📌 Get all quizzes (alias)
export const getQuizzes = async (params = {}) => {
  const res = await axios.get(`${API_URL}/quizzes`, { params });
  return res.data;
};

// 📌 Get attempts by student
export const getAttempts = async (studentId) => {
  const res = await axios.get(`${API_URL}/attempts?studentId=${studentId}`);
  return res.data;
};
