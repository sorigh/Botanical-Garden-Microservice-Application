// src/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export function ProtectedRoute({ allowedRoles, children, fallback }) {
  const auth = useAuth();
  // Add logs here:
  console.log("Auth object:", auth);
  console.log("Roles array:", auth?.roles);
  console.log("Auth:", auth);
  console.log("Allowed Roles:", allowedRoles);

  if (!auth) {
    // Nu e logat deloc => intoarce fallback sau redirectionare
    return fallback ?? <Navigate to="/login-page" />;
  }

  const hasAccess = auth.roles.some(role => allowedRoles.includes(role));
  console.log("Has Access:", hasAccess);
  
  if (!hasAccess) {
    // Logged in but role not allowed
    return fallback ?? <Navigate to="/login-page" replace />;
  }


  return children;
}
