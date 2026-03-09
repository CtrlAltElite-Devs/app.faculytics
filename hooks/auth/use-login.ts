"use client";

import { persistSidebarOpenState } from "@/components/ui/sidebar";
import { login } from "@/network/requests/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";

/**
 * Login mutation hook.
 * Handles API call, validation of token payload, and session persistence to Zustand.
 */
export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      persistSidebarOpenState(false);
      setSession(data.token, data.refreshToken);
    },
  });
}
