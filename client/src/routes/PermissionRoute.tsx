import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuthStore } from "../store/auth.store";
import { hasPermission } from "../utils/permissions";

interface PermissionRouteProps {
  permission: string;
  children?: React.ReactNode;
}

const PermissionRoute = ({
  permission,
  children,
}: PermissionRouteProps) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const location = useLocation();

  // No token means the user is not authenticated.
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // The token exists, but the current user has not
  // yet been restored into the authentication store.
  // Do not redirect to login just because user is null.
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="text-sm text-slate-500">
            Loading your permissions...
          </p>
        </div>
      </div>
    );
  }

  // Administrators have full access.
  if (user.role === "ADMIN") {
    return children ? <>{children}</> : <Outlet />;
  }

  // Check the requested permission for other roles.
  const allowed = hasPermission(user, permission);

  if (!allowed) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{
          from: location.pathname,
          denied: true,
        }}
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PermissionRoute;