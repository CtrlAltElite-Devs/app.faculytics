"use client";

import { AppLoadingScreen } from "@/components/shared/app-loading-screen";
import { useAuthSessionState } from "@/features/auth/hooks/use-auth-session-state";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const { status } = useAuthSessionState();

  useEffect(() => {
    if (status === "hydrating" || status === "loading-profile") return;

    if (status === "signed-out") {
      router.replace("/auth");
      return;
    }

    if (status === "invalid-session" || status === "unsupported-role") {
      clearSession();
      router.replace("/auth");
      return;
    }
  }, [clearSession, router, status]);

  if (status === "hydrating" || status === "loading-profile") {
    return <AppLoadingScreen message="Restoring your session..." />;
  }

  if (status !== "authenticated") {
    return null;
  }

  return <>{children}</>;
}
