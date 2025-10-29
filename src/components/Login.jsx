import React, { useState } from "react";
import { login } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Added error state for better UX
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError("Please fill in all fields");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const data = await login(email, password);

    if (!data || !data.user || !data.token) {
      throw new Error("Invalid response from server");
    }

    const user = data.user;
    const token = data.token;

    // ✅ Student Login — fetch actual student record
   if (user.role === "student") {
  let studentData = null;
  try {
    const res = await fetch(
      `http://localhost:4000/api/students/${user._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) studentData = await res.json();
    else console.warn("Could not fetch student record");
  } catch (err) {
    console.error("Error fetching student:", err);
  }

  // Store both studentToken (for legacy usage) AND main token+user so ProtectedRoutes find them
  localStorage.setItem("studentToken", token);
  localStorage.setItem("student", JSON.stringify(studentData || user));

  // also store user & token (so app's auth initialization sees it)
  localStorage.setItem("user", JSON.stringify(studentData || user));
  localStorage.setItem("token", token);

  navigate("/student");
  if (onLogin) onLogin(studentData || user);
  setLoading(false);
  return;
}
    // ✅ Parent Login — also store child's profile directly from backend response
else if (user.role === "parent") {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  // If backend already sent childProfile, save it
  if (data.childProfile) {
    localStorage.setItem("student", JSON.stringify(data.childProfile));
  }

  navigate("/parent");
}

    // ✅ Teacher/Admin/Staff
    else {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      switch (user.role) {
        case "teacher":
          navigate("/teacher");
          break;
        case "admin":
        case "superadmin":
        case "staff":
          navigate("/admin");
          break;
        default:
          console.warn("Unknown role:", user.role);
          navigate("/login");
      }
    }

    if (onLogin) onLogin(user);
  } catch (err) {
    console.error("Login error:", err);
    setError(err.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
      }}
      
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "350px",
          textAlign: "center",
        }}
      >
        {/* ✅ Logo */}
        <img
          src={logo}
          alt="Vikas Education Logo"
          style={{ width: "80px", marginBottom: "10px" }}
        />

        <h2 style={{ marginBottom: "10px", color: "#1976d2" }}>
          🎓 Vikash Education Centre Adbhar
        </h2>
        <p style={{ marginBottom: "20px", color: "#555" }}>
          Login to your account
        </p>

        {/* Error Message */}
        {error && (
          <div style={{
            color: "#d32f2f",
            backgroundColor: "#ffebee",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(""); // Clear error when user starts typing
            }}
            required
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: error ? "1px solid #d32f2f" : "1px solid #ccc",
              boxSizing: "border-box", // Added for proper width calculation
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(""); // Clear error when user starts typing
            }}
            required
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: error ? "1px solid #d32f2f" : "1px solid #ccc",
              boxSizing: "border-box", // Added for proper width calculation
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              background: loading ? "#ccc" : "#1976d2",
              color: "white",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s", // Added smooth transition
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Extra Options */}
        <div style={{ marginTop: "15px", fontSize: "14px" }}>
          <Link 
            to="/forgot-password" 
            style={{ 
              color: "#1976d2", 
              textDecoration: "none",
              pointerEvents: loading ? "none" : "auto" // Disable link during loading
            }}
          >
            Forgot Password?
          </Link>
          <br />
          <span style={{ color: loading ? "#ccc" : "inherit" }}>
            Don't have an account?{" "}
          </span>
          <Link 
            to="/signup" 
            style={{ 
              color: loading ? "#ccc" : "#1976d2", 
              textDecoration: "none",
              pointerEvents: loading ? "none" : "auto" // Disable link during loading
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;