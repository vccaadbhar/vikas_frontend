// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";

import Login from "./components/Login";
import Signup from "./components/Signup"; // ✅ Added
import ForgotPassword from "./components/ForgotPassword"; 
import AdminDashboard from "./components/AdminDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import ParentDashboard from "./components/ParentDashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Initialize user from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const studentData = localStorage.getItem("student");
        const studentToken = localStorage.getItem("studentToken");

        if (studentData && studentToken) {
          const student = JSON.parse(studentData);
          student.token = studentToken;
          setUser(student);
          setLoading(false);
          return;
        }

        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (userData && token) {
          const u = JSON.parse(userData);
          u.token = token;
          setUser(u);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = "/login";
  };

  // ✅ ProtectedRoute Wrapper
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (loading)
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      );

    if (!user) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      switch (user.role) {
        case "student":
          return <Navigate to="/student" replace />;
        case "teacher":
          return <Navigate to="/teacher" replace />;
        case "parent":
          return <Navigate to="/parent" replace />;
        default:
          return <Navigate to="/admin" replace />;
      }
    }

    return children;
  };

  // ✅ Fix: Always allow /login route when user is null
  if (!loading && !user && window.location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* Global Header visible everywhere */}
      <Header user={user} onLogout={handleLogout} />

      {/* All routes */}
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={
                  user.role === "student"
                    ? "/student"
                    : user.role === "teacher"
                    ? "/teacher"
                    : user.role === "parent"
                    ? "/parent"
                    : "/admin"
                }
                replace
              />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        {/* Signup */}
        <Route path="/signup" element={<Signup />} />

        {/* Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin", "staff"]}>
              <AdminDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Teacher */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard teacher={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Student */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Parent */}
        <Route
          path="/parent/*"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={
                  user.role === "student"
                    ? "/student"
                    : user.role === "teacher"
                    ? "/teacher"
                    : user.role === "parent"
                    ? "/parent"
                    : "/admin"
                }
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
