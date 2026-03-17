"use client";

import { useActiveRole } from "@/features/auth/hooks/use-active-role";
import { useMe } from "@/features/auth/hooks/use-me";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

type RoleGuardProps = {
  allowedRoles: string[];
  children: ReactNode;
};

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const clearSession = useAuthStore((state) => state.clearSession);
  const { data: me, isPending: isMePending, isError: isMeError } = useMe();
  const { activeRole, roleHome } = useActiveRole();
  const roles = me?.roles ?? [];
  const hasAnyAllowedRole = roles.some((role) => allowedRoles.includes(role));
  const isAllowed = Boolean(activeRole && allowedRoles.includes(activeRole));

  useEffect(() => {
    if (isMePending) return;

    if (isMeError) {
      clearSession();
      router.replace("/auth?error=me-failed");
      return;
    }

    if (!roleHome) {
      clearSession();
      router.replace("/auth?error=no-role");
      return;
    }

    if (!hasAnyAllowedRole) {
      router.replace(roleHome);
      return;
    }

    if (!isAllowed && pathname !== roleHome) {
      router.replace(roleHome);
    }
  }, [clearSession, hasAnyAllowedRole, isAllowed, isMeError, isMePending, pathname, roleHome, router]);

  if (isMePending || isMeError || !roleHome || !isAllowed) {
    return null;
  }

  return <>{children}</>;
}
