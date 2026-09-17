import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const user = getCurrentUser();

  // Login nahi hai
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Role allowed nahi hai
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }

    if (user.role === "staff") {
      return (
        <Navigate
          to="/staff"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;