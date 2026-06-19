import { create } from "zustand";
import { persist } from "zustand/middleware";

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: (newToken) => {
        const user = decodeToken(newToken);
        set({ token: newToken, user });
      },

      logout: () => set({ token: null, user: null }),
    }),
    { name: "techstore-auth" }
  )
);

export function useAuth() {
  const { token, user, login, logout } = useAuthStore();
  return { token, user, isAuthenticated: !!token && !!user, login, logout };
}
