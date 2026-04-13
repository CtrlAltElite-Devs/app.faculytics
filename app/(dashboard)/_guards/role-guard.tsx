"use client";

import { AppLoadingScreen } from "@/components/shared/app-loading-screen";
import type { AppRole } from "@/constants/roles";
import { useAuthSessionState } from "@/features/auth/hooks/use-auth-session-state";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

type RoleGuardProps = {
  allowedRoles: AppRole[];
  children: ReactNode;
};

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const clearSession = useAuthStore((state) => state.clearSession);
  const pendingRedirectPath = useAuthStore((state) => state.pendingRedirectPath);
  const setPendingRedirectPath = useAuthStore((state) => state.setPendingRedirectPath);
  const { activeRole, roleHome, roles, status } = useAuthSessionState();
  const hasAnyAllowedRole = roles.some((role) => allowedRoles.includes(role));
  const isAllowed = Boolean(activeRole && allowedRoles.includes(activeRole));
  const authenticatedHome = status === "authenticated" ? roleHome : null;

  useEffect(() => {
    if (status === "hydrating" || status === "loading-profile") return;

    if (pendingRedirectPath && authenticatedHome === pendingRedirectPath) {
      if (pathname === pendingRedirectPath) {
        setPendingRedirectPath(null);
      }

      return;
    }

    if (status === "signed-out" || status === "invalid-session" || status === "unsupported-role") {
      clearSession();
      router.replace("/auth");
      return;
    }

    if (!authenticatedHome) {
      return;
    }

    if (!hasAnyAllowedRole) {
      router.replace(authenticatedHome);
      return;
    }

    if (!isAllowed && pathname !== authenticatedHome) {
      router.replace(authenticatedHome);
    }
  }, [
    authenticatedHome,
    clearSession,
    hasAnyAllowedRole,
    isAllowed,
    pathname,
    pendingRedirectPath,
    router,
    setPendingRedirectPath,
    status,
  ]);

  if (status === "hydrating" || status === "loading-profile") {
    return <AppLoadingScreen message="Checking access..." />;
  }

  if (status !== "authenticated" || !isAllowed) {
    return null;
  }

  return <>{children}</>;
}
