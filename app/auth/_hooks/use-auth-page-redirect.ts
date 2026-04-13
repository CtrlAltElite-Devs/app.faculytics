"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

import type { AuthSessionStatus } from "@/features/auth/hooks/use-auth-session-state";

type UseAuthPageRedirectParams = {
  status: AuthSessionStatus;
  roleHome: string | null;
  clearSession: () => void;
  setUnsupportedRoleMessage: (message: string | null) => void;
};

export function useAuthPageRedirect({
  status,
  roleHome,
  clearSession,
  setUnsupportedRoleMessage,
}: UseAuthPageRedirectParams) {
  const router = useRouter();

  useEffect(() => {
    if (status === "signed-out" || status === "hydrating" || status === "loading-profile") {
      return;
    }

    if (status === "invalid-session") {
      clearSession();
      return;
    }

    if (status === "authenticated" && roleHome) {
      startTransition(() => {
        setUnsupportedRoleMessage(null);
      });
      router.replace(roleHome);
      return;
    }

    if (status === "unsupported-role") {
      startTransition(() => {
        setUnsupportedRoleMessage(
          "Your account does not have a supported role for Faculytics yet. Contact your administrator."
        );
      });
      clearSession();
    }
  }, [clearSession, roleHome, router, setUnsupportedRoleMessage, status]);
}
