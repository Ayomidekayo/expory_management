import { create } from "zustand";
import { queryClient } from "../lib/react-query";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  permissions: string[];
  phone?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;

  login: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  token:
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null,

  login(user, token) {
    localStorage.setItem("token", token);

    set({
      user,
      token,
    });
  },

  setUser(user) {
    set({ user });
  },

  logout() {
    localStorage.removeItem("token");

    queryClient.clear();

    set({
      user: null,
      token: null,
    });
  },
}));