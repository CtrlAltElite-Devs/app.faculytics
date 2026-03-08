"use client";

import { useMe } from "@/hooks/auth/use-me";
import { resolveHomeFromRoles } from "@/lib/auth/role-route";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";

type RoleGuardProps = {
  allowedRoles: string[];
  children: ReactNode;
};

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const { data: me, isPending: isMePending, isError: isMeError } = useMe();

  const roles = useMemo(() => me?.roles ?? [], [me?.roles]);
  const roleHome = resolveHomeFromRoles(roles);
  const isAllowed = roles.some((role) => allowedRoles.includes(role));

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

    if (!isAllowed) {
      router.replace(roleHome);
    }
  }, [clearSession, isAllowed, isMeError, isMePending, roleHome, router]);

  if (isMePending || isMeError || !roleHome || !isAllowed) {
    return null;
  }

  return <>{children}</>;
}
