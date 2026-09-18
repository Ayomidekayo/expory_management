import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

interface Props {
  roles: string[];
}

const RoleRoute = ({ roles }: Props) => {
  const user = useAuthStore(
    (state) => state.user
  );

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!roles.includes(user.role)) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
};

export default RoleRoute;