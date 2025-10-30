import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function login(email, password) {
  const res = await axios.post(`${API}/auth/login`, { email, password });
  return res.data;
}

export async function forgotPassword(email, newPassword) {
  const res = await axios.post(`${API}/forgot-password`, { email, newPassword });
  return res.data;
}
