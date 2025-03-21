import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";
import Layout from "./Layout";

export function RequireAuth() {
  const { isAuthenticated } = useSelector(selectUser);
  let location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Layout />;
}

export function PublicRoutes() {
  const { isAuthenticated } = useSelector(selectUser);
  let location = useLocation();
  if (!isAuthenticated) {
    return <Outlet />;
  }
  const to = location?.state?.from?.pathname || "/dashboard";
  return <Navigate to={to} state={{ from: location }} replace />;
}
