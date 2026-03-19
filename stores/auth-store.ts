import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AppRole } from "@/constants/roles";

type AuthStore = {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  activeRole: AppRole | null;
  pendingRoleHome: string | null;
  setHydrated: (hydrated: boolean) => void;
  setSession: (token: string, refreshToken: string) => void;
  setActiveRole: (activeRole: AppRole | null) => void;
  setPendingRoleHome: (pendingRoleHome: string | null) => void;
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
      pendingRoleHome: null,
      setHydrated: (hydrated) => set({ hydrated }),

      setSession: (token, refreshToken) =>
        set({
          token,
          refreshToken,
          isAuthenticated: Boolean(token),
          hydrated: true,
        }),
      setActiveRole: (activeRole) => set({ activeRole }),
      setPendingRoleHome: (pendingRoleHome) => set({ pendingRoleHome }),
      clearSession: () =>
        set({
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          hydrated: true,
          activeRole: null,
          pendingRoleHome: null,
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
    },
  ),
);
