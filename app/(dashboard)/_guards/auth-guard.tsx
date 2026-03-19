"use client";

import { AppLoadingScreen } from "@/components/shared/app-loading-screen";
import { useActiveRole } from "@/features/auth/hooks/use-active-role";
import { useMe } from "@/features/auth/hooks/use-me";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { isPending: isMePending, isError: isMeError } = useMe();
  const { activeRole, roleHome } = useActiveRole();

  useEffect(() => {
    if (!hydrated) return;

    if (!token) {
      router.replace("/auth");
      return;
    }

    if (isMePending) return;

    if (isMeError) {
      clearSession();
      router.replace("/auth");
      return;
    }

    if (!activeRole || !roleHome) {
      clearSession();
      router.replace("/auth");
    }
  }, [activeRole, clearSession, hydrated, isMeError, isMePending, roleHome, router, token]);

  if (!hydrated || isMePending) {
    return <AppLoadingScreen message="Restoring your session..." />;
  }

  if (token && !isMeError && (!activeRole || !roleHome)) {
    return <AppLoadingScreen message="Loading your dashboard..." />;
  }

  if (!token || isMeError || !activeRole || !roleHome) {
    return null;
  }

  return <>{children}</>;
}
