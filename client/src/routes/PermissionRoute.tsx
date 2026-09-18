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

  const location = useLocation();

  // User is not loaded/authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ADMIN automatically has full access
  if (user.role === "ADMIN") {
    return children ? <>{children}</> : <Outlet />;
  }

  // Check requested permission
  const allowed = hasPermission(
    user,
    permission
  );

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