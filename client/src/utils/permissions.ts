export interface PermissionUser {
  role: string;
  permissions?: string[];
}

export const hasPermission = (
  user: PermissionUser | null | undefined,
  permission: string
): boolean => {
  if (!user) return false;

  // ADMIN always has full access
  if (user.role === "ADMIN") {
    return true;
  }

  return user.permissions?.includes(permission) ?? false;
};