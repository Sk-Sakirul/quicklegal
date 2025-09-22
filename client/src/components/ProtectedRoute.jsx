// src/components/shared/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If roles are restricted and user role not allowed
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  // ✅ This will render the nested child route
  return <Outlet />;
};

export default ProtectedRoute;
