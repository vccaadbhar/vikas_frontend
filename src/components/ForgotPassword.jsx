// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("⚠️ Please enter your registered email.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      // ✅ Replace with your backend endpoint if available
      const res = await axios.post("http://localhost:4000/api/auth/forgot-password", { email });
      setMessage("✅ Password reset link sent! Check your email.");
      console.log(res.data);
    } catch (err) {
      setMessage("❌ Failed to send reset link. " + (err.response?.data?.msg || err.message));
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
        <h2 style={{ color: "#1976d2", marginBottom: "20px" }}>🔐 Forgot Password</h2>
        <p>Enter your registered email to receive a reset link.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
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
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "15px", color: message.includes("❌") ? "red" : "green" }}>
            {message}
          </p>
        )}

        <div style={{ marginTop: "15px", fontSize: "14px" }}>
          <Link to="/login" style={{ color: "#1976d2", textDecoration: "none" }}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
