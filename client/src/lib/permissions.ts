export const hasPermission = (
  user:
    | {
        role: string;
        permissions?: string[];
      }
    | null
    | undefined,
  permission: string
) => {
  if (!user) return false;

  if (user.role === "ADMIN") {
    return true;
  }

  return (
    user.permissions?.includes(permission) ??
    false
  );
};