import axios from "axios";

const API = "http://localhost:4000/api";

const token = () => localStorage.getItem("token");

// Fetch all teachers
export async function getTeachers() {
  const res = await axios.get(`${API}/auth/teachers`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return res.data;
}

// Fetch all students
export async function getStudents() {
  const res = await axios.get(`${API}/auth/students`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return res.data;
}

// Fetch fees summary
export async function getFinance() {
  const res = await axios.get(`${API}/reports/finance`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return res.data;
}
