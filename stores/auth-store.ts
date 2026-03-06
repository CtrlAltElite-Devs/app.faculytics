import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthStore = {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setSession: (token: string, refreshToken: string) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setSession: (token, refreshToken) =>
        set({
          token,
          refreshToken,
          isAuthenticated: Boolean(token),
        }),
      clearSession: () =>
        set({
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
