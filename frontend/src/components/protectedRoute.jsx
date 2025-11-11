// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  // not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // not admin trying to access admin-only route
  if (adminOnly && email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return children;
}
