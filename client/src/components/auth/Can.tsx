import type { ReactNode } from "react";

import { useAuthStore } from "../../store/auth.store";
import { hasPermission } from "../../utils/permissions";

interface CanProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function Can({
  permission,
  children,
  fallback = null,
}: CanProps) {
  const user = useAuthStore((state) => state.user);

  if (!hasPermission(user, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}