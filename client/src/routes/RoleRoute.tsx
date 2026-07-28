import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  roles: string[];
}

const RoleRoute = ({ roles }: Props) => {
  const user = useSelector((state: any) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;