"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

type UseAuthPageRedirectParams = {
  token: string | null;
  isMePending: boolean;
  isMeError: boolean;
  hasProfile: boolean;
  roleHome: string | null;
  clearSession: () => void;
  setUnsupportedRoleMessage: (message: string | null) => void;
};

export function useAuthPageRedirect({
  token,
  isMePending,
  isMeError,
  hasProfile,
  roleHome,
  clearSession,
  setUnsupportedRoleMessage,
}: UseAuthPageRedirectParams) {
  const router = useRouter();

  useEffect(() => {
    if (!token || isMePending) return;

    if (isMeError) {
      clearSession();
      return;
    }

    if (roleHome) {
      startTransition(() => {
        setUnsupportedRoleMessage(null);
      });
      router.replace(roleHome);
      return;
    }

    if (hasProfile) {
      startTransition(() => {
        setUnsupportedRoleMessage(
          "Your account does not have a supported role for Faculytics yet. Contact your administrator."
        );
      });
      clearSession();
    }
  }, [
    clearSession,
    hasProfile,
    isMeError,
    isMePending,
    roleHome,
    router,
    setUnsupportedRoleMessage,
    token,
  ]);
}
