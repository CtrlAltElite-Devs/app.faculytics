import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AppRole } from "@/constants/roles";

type AuthStore = {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  activeRole: AppRole | null;
  pendingRedirectPath: string | null;
  setHydrated: (hydrated: boolean) => void;
  setSession: (token: string, refreshToken: string) => void;
  setActiveRole: (activeRole: AppRole | null) => void;
  setPendingRedirectPath: (pendingRedirectPath: string | null) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      hydrated: false,
      activeRole: null,
      pendingRedirectPath: null,
      setHydrated: (hydrated) => set({ hydrated }),

      setSession: (token, refreshToken) =>
        set({
          token,
          refreshToken,
          isAuthenticated: Boolean(token),
          hydrated: true,
        }),
      setActiveRole: (activeRole) => set({ activeRole }),
      setPendingRedirectPath: (pendingRedirectPath) => set({ pendingRedirectPath }),
      clearSession: () =>
        set({
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          hydrated: true,
          activeRole: null,
          pendingRedirectPath: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        activeRole: state.activeRole,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
