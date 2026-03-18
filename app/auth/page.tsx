"use client";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { useActiveRole } from "@/features/auth/hooks/use-active-role";
import { useMe } from "@/features/auth/hooks/use-me";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import { AuthLoginForm } from "./_components/auth-login-form";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: me, isPending: isMePending, isError: isMeError } = useMe();
  const { roleHome } = useActiveRole();
  const clearSession = useAuthStore((state) => state.clearSession);
  const token = useAuthStore((state) => state.token);
  const [unsupportedRoleMessage, setUnsupportedRoleMessage] = useState<string | null>(null);
  const isAuthenticating = Boolean(token) && isMePending;
  const authError = searchParams.get("error");
  const statusMessage =
    unsupportedRoleMessage ??
    (authError === "me-failed"
      ? "We could not restore your session. Please sign in again."
      : authError === "no-role"
        ? "Your account does not have a supported role for this app yet. Contact your administrator."
        : null);

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

    if (me) {
      startTransition(() => {
        setUnsupportedRoleMessage(
          "Your account does not have a supported role for this app yet. Contact your administrator.",
        );
      });
      clearSession();
    }
  }, [clearSession, isMeError, isMePending, me, roleHome, router, token]);

  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-10">
      <div className="relative hidden overflow-hidden lg:col-span-7 lg:block">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(44, 58, 208)"
          gradientBackgroundEnd="rgb(30, 40, 150)"
          firstColor="60, 100, 255"
          secondColor="80, 130, 255"
          thirdColor="40, 80, 220"
          fourthColor="0, 0, 0, 0"
          fifthColor="0, 0, 0, 0"
          pointerColor="60, 100, 255"
          size="50%"
          containerClassName="h-full w-full"
        >
          <div className="pointer-events-none absolute inset-0 z-50 flex flex-col justify-end p-16 text-white">
            <div className="mb-16 space-y-6">
              <h1 className="text-5xl font-playfair font-semibold leading-tight">
                Data-driven decisions for better education
              </h1>
              <p className="max-w-lg text-xl font-medium opacity-90">
                Powered by artificial intelligence to deliver real-time insights and smart
                recommendations.
              </p>
            </div>
            <div className="text-sm opacity-70">2026 Faculytics. All rights reserved.</div>
          </div>
        </BackgroundGradientAnimation>
      </div>

      <div className="col-span-1 flex flex-col lg:col-span-3">
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
          <h3 className="text-xl font-playfair font-semibold">Faculytics 2.0</h3>
          <ThemeToggle />
        </div>

        <div className="flex grow items-center justify-center px-6 sm:px-10 lg:px-12">
          <AuthLoginForm isAuthenticating={isAuthenticating} statusMessage={statusMessage} />
        </div>
      </div>
    </div>
  );
}
