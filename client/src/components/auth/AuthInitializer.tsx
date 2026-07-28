import { useEffect } from "react";

import { useAuthStore } from "../../store/auth.store";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export default function AuthInitializer() {
  const token =
    useAuthStore(
      (state) => state.token
    );

  const setUser =
    useAuthStore(
      (state) => state.setUser
    );

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  const {
    data,
    isSuccess,
    isError,
  } = useCurrentUser();

  useEffect(() => {
    if (!token) return;

    if (isSuccess && data) {
      setUser(data.data);
    }

    if (isError) {
      logout();
    }
  }, [
    token,
    isSuccess,
    isError,
    data,
    setUser,
    logout,
  ]);

  return null;
}