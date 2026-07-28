import { create } from "zustand";
import { queryClient } from "../lib/react-query";

interface User {
  id: string;

  name: string;

  email: string;

  role: string;
}

interface AuthState {
  user: User | null;

  token: string | null;

  login: (
    user: User,
    token: string
  ) => void;

  setUser: (
    user: User
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,

    token:
      localStorage.getItem("token"),

    login(user, token) {
      localStorage.setItem(
        "token",
        token
      );

      set({
        user,
        token,
      });
    },

    setUser(user) {
      set({
        user,
      });
    },

    logout() {
      localStorage.removeItem(
        "token"
      );
 queryClient.clear();
      set({
        user: null,
        token: null,
      });
    },
  }));