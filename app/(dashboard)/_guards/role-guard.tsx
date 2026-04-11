"use client";

import { AppLoadingScreen } from "@/components/shared/app-loading-screen";
import type { AppRole } from "@/constants/roles";
import { useActiveRole } from "@/features/auth/hooks/use-active-role";
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
  const {
    activeRole,
    roleHome,
    roles,
    isPending: isMePending,
    isError: isMeError,
  } = useActiveRole();
  const hasAnyAllowedRole = roles.some((role) => allowedRoles.includes(role));
  const isAllowed = Boolean(activeRole && allowedRoles.includes(activeRole));

  useEffect(() => {
    if (isMePending) return;

    if (pendingRedirectPath && roleHome === pendingRedirectPath) {
      if (pathname === pendingRedirectPath) {
        setPendingRedirectPath(null);
      }

      return;
    }

    if (isMeError) {
      clearSession();
      router.replace("/auth");
      return;
    }

    if (!roleHome) {
      clearSession();
      router.replace("/auth");
      return;
    }

    if (!hasAnyAllowedRole) {
      router.replace(roleHome);
      return;
    }

    if (!isAllowed && pathname !== roleHome) {
      router.replace(roleHome);
    }
  }, [
    clearSession,
    hasAnyAllowedRole,
    isAllowed,
    isMeError,
    isMePending,
    pathname,
    pendingRedirectPath,
    roleHome,
    router,
    setPendingRedirectPath,
  ]);

  if (isMePending || !roleHome) {
    return <AppLoadingScreen message="Checking access..." />;
  }

  if (isMeError || !isAllowed) {
    return null;
  }

  return <>{children}</>;
}
