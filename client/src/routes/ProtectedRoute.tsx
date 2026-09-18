import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAuthStore } from "../store/auth.store";

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    data,
    isLoading,
    isError,
  } = useCurrentUser();

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
    }
  }, [data, setUser]);

  // No token = not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists, but we're still loading the user
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="text-sm text-slate-500">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  // Token is invalid / expired / user unavailable
  if (isError || !data?.data) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;