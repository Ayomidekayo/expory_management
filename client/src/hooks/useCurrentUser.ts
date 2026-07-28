import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { getCurrentUser } from "../api/auth/auth.api";

export function useCurrentUser() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["current-user", token],

    queryFn: getCurrentUser,

    enabled: !!token,

    retry: false,

    staleTime: 0,
  });
}