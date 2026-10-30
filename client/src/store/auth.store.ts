// import { create } from "zustand";
// import { queryClient } from "../lib/react-query";

// export interface AuthUser {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   isActive?: boolean;
//   permissions: string[];
//   phone?: string | null;
// }

// interface AuthState {
//   user: AuthUser | null;
//   token: string | null;

//   login: (user: AuthUser, token: string) => void;
//   setUser: (user: AuthUser) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,

//   token:
//     typeof window !== "undefined"
//       ? localStorage.getItem("token")
//       : null,

//   login(user, token) {
//     localStorage.setItem("token", token);

//     set({
//       user,
//       token,
//     });
//   },

//   setUser(user) {
//     set({ user });
//   },

//   logout() {
//     localStorage.removeItem("token");

//     queryClient.clear();

//     set({
//       user: null,
//       token: null,
//     });
//   },
// }));




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

export type LoginPath = "/login" | "/exporter/login";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser) => void;
  /** Clears authentication state and returns the appropriate login route. */
  logout: (fallbackPath?: LoginPath) => LoginPath;
}

const getStoredRole = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("authRole");
};

const persistRole = (role: string): void => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("authRole", role.trim().toUpperCase());
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,

  token:
    typeof window !== "undefined"
      ? window.localStorage.getItem("token")
      : null,

  login(user, token) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("authRole", user.role.trim().toUpperCase());
    }

    set({ user, token });
  },

  setUser(user) {
    persistRole(user.role);
    set({ user });
  },

  logout(fallbackPath) {
    // Capture the role before clearing the store. authRole also covers page
    // refreshes where the token exists but the user object has not loaded yet.
    const role = (get().user?.role ?? getStoredRole() ?? "").trim().toUpperCase();
    const loginPath: LoginPath =
      role === "EXPORTER"
        ? "/exporter/login"
        : role
          ? "/login"
          : fallbackPath ?? "/login";

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("authRole");
    }

    queryClient.clear();
    set({ user: null, token: null });

    return loginPath;
  },
}));
