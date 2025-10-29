// src/services/dashboard.js
import axios from "axios";

const API = "http://localhost:4000/api/dashboard";

// 📊 Get Student Dashboard
export async function getStudentDashboard(token) {
  try {
    const res = await axios.get(`${API}/student`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { msg: "Failed to load student dashboard" };
  }
}

// 👨‍👩‍👦 Parent Dashboard
export async function getParentDashboard(token) {
  try {
    const res = await axios.get(`${API}/parent`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { msg: "Failed to load parent dashboard" };
  }
}

// 🛠 Admin Dashboard
export async function getAdminDashboard(token) {
  try {
    const res = await axios.get(`${API}/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { msg: "Failed to load admin dashboard" };
  }
}
