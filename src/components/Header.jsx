import React from "react";
import { Link } from "react-router-dom";

function Header({ user, onLogout }) {
  return (
    <header
      style={{
        background: "#1976d2",
        color: "white",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>🎓 Vikash Education Center Adbhar</h2>

      <nav style={{ display: "flex", gap: "15px" }}>
        {!user && (
          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
            Login
          </Link>
        )}

        {user?.role === "student" && (
          <Link to="/student" style={{ color: "white", textDecoration: "none" }}>
            Student Dashboard
          </Link>
        )}

        {user?.role === "parent" && (
          <Link to="/parent" style={{ color: "white", textDecoration: "none" }}>
            Parent Dashboard
          </Link>
        )}

        {user?.role === "teacher" && (
          <Link to="/teacher" style={{ color: "white", textDecoration: "none" }}>
            Teacher Dashboard
          </Link>
        )}

        {(user?.role === "superadmin" || user?.role === "staff") && (
          <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
            Admin Dashboard
          </Link>
        )}

        {user && (
          <button
            onClick={onLogout}
            style={{
              background: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
