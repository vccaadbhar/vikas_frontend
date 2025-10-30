import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL; // ✅ change to your server URL in production
});

// Automatically add token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token"); // use AsyncStorage in React Native
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
