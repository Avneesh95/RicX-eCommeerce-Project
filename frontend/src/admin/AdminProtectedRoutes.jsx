import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (
    !user ||
    (user.role !== "admin" &&
      user.role !== "superAdmin")
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}