"use client";

import { useMe } from "@/hooks/auth/use-me";
import { resolveHomeFromRoles } from "@/lib/auth/role-route";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { data: me, isPending: isMePending, isError: isMeError } = useMe();
  const roleHome = useMemo(() => resolveHomeFromRoles(me?.roles), [me?.roles]);

  useEffect(() => {
    if (!hydrated) return;

    if (!token) {
      router.replace("/auth");
      return;
    }

    if (isMePending) return;

    if (isMeError) {
      clearSession();
      router.replace("/auth?error=me-failed");
      return;
    }

    if (!roleHome) {
      clearSession();
      router.replace("/auth?error=no-role");
    }
  }, [clearSession, hydrated, isMeError, isMePending, roleHome, router, token]);

  if (!hydrated || !token || isMePending || isMeError || !roleHome) {
    return null;
  }

  return <>{children}</>;
}
