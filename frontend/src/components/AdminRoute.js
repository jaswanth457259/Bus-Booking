import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAdmin, isAuthenticated } from "../utils/auth";

function AdminRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/search" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
