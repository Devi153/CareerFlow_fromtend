import { Navigate, Outlet } from "react-router-dom";
import {
  getStoredRole,
  getStoredToken,
} from "./authService";

function ProtectedRoute({ allowedRole }) {
  const token = getStoredToken();
  const storedRole = getStoredRole();

  /*
   * Normalize stored role.
   *
   * Examples:
   *
   * "admin"   → "ADMIN"
   * "ADMIN"   → "ADMIN"
   * "student" → "STUDENT"
   * "STUDENT" → "STUDENT"
   */
  const role = storedRole
    ? storedRole.trim().toUpperCase()
    : "";

  const requiredRole = allowedRole
    ? allowedRole.trim().toUpperCase()
    : "";

  /*
   * =========================================================
   * 1. AUTHENTICATION CHECK
   * =========================================================
   *
   * No JWT means the user is not authenticated.
   */
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /*
   * =========================================================
   * 2. ROLE VALIDATION
   * =========================================================
   *
   * CareerFlow currently supports:
   *
   * ADMIN
   * STUDENT
   */
  if (
    role !== "ADMIN" &&
    role !== "STUDENT"
  ) {
    /*
     * The correct token key is "token".
     *
     * authService stores:
     *
     * localStorage.setItem("token", token)
     */
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /*
   * =========================================================
   * 3. ROLE AUTHORIZATION
   * =========================================================
   *
   * Example:
   *
   * ADMIN → /student/*
   * STUDENT → /admin/*
   *
   * The user is redirected to their own dashboard.
   */
  if (
    requiredRole &&
    role !== requiredRole
  ) {
    if (role === "ADMIN") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    if (role === "STUDENT") {
      return (
        <Navigate
          to="/student/dashboard"
          replace
        />
      );
    }
  }

  /*
   * =========================================================
   * 4. AUTHENTICATED + AUTHORIZED
   * =========================================================
   */
  return <Outlet />;
}

export default ProtectedRoute;