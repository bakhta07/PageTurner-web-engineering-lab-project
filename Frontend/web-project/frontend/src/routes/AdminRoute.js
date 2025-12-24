import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  // Read from separate Admin Session
  const adminUser = JSON.parse(localStorage.getItem("adminUser"));

  if (!adminUser) {
    return <Navigate to="/admin-panel" replace />;
  }

  if (adminUser.role !== "admin") {
    // Should generally not happen if Login logic is correct, but safe guard
    return <Navigate to="/admin-panel" replace />;
  }

  return children;
};

export default AdminRoute;
