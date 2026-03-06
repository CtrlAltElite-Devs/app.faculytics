import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthStore = {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  setSession: (token: string, refreshToken: string) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),

      setSession: (token, refreshToken) =>
        set({
          token,
          refreshToken,
          isAuthenticated: Boolean(token),
          hydrated: true,
        }),
      clearSession: () =>
        set({
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          hydrated: true,
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
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
