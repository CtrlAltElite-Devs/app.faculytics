"use client";

import { useAuthStore } from "@/stores/auth-store";

import { useActiveRole } from "@/features/auth/hooks/use-active-role";

export type AuthSessionStatus =
  | "hydrating"
  | "signed-out"
  | "loading-profile"
  | "invalid-session"
  | "authenticated"
  | "unsupported-role";

export function useAuthSessionState() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);
  const activeRoleState = useActiveRole();
  const { me, activeRole, roleHome, isPending, isError, roles } = activeRoleState;

  let status: AuthSessionStatus;

  if (!hydrated) {
    status = "hydrating";
  } else if (!token) {
    status = "signed-out";
  } else if (isPending) {
    status = "loading-profile";
  } else if (isError) {
    status = "invalid-session";
  } else if (activeRole && roleHome) {
    status = "authenticated";
  } else if (me) {
    status = "unsupported-role";
  } else {
    status = "loading-profile";
  }

  return {
    ...activeRoleState,
    hydrated,
    token,
    roles,
    status,
  };
}
