// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roleRequired }) {
  // Accept main token OR student token (legacy)
  const token = localStorage.getItem("token") || localStorage.getItem("studentToken");
  // Accept user OR student object
  const rawUser = localStorage.getItem("user") || localStorage.getItem("student");
  const user = rawUser ? JSON.parse(rawUser) : null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired) {
    const roles = Array.isArray(roleRequired)
      ? roleRequired
      : roleRequired.split("|");
    if (!roles.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
