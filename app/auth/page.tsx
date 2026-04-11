"use client";

import { useState } from "react";

import { AppBrand } from "@/components/layout/app-brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { useAuthSessionState } from "@/features/auth/hooks/use-auth-session-state";
import { branding } from "@/constants/branding";
import { useAuthStore } from "@/stores/auth-store";

import { AuthLoginForm } from "./_components/auth-login-form";
import { useAuthPageRedirect } from "./_hooks/use-auth-page-redirect";

export default function AuthPage() {
  const { roleHome, status } = useAuthSessionState();
  const clearSession = useAuthStore((state) => state.clearSession);
  const [unsupportedRoleMessage, setUnsupportedRoleMessage] = useState<string | null>(null);
  const isAuthenticating = status === "loading-profile";

  useAuthPageRedirect({
    status,
    roleHome,
    clearSession,
    setUnsupportedRoleMessage,
  });

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
                Faculty evaluation insights for academic teams
              </h1>
              <p className="max-w-lg text-xl font-medium opacity-90">
                Track feedback, monitor teaching trends, and support better academic decisions.
              </p>
            </div>
            <div className="text-sm opacity-70">{branding.APP_COPYRIGHT}</div>
          </div>
        </BackgroundGradientAnimation>
      </div>

      <div className="col-span-1 flex flex-col lg:col-span-3">
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
          <AppBrand
            priority
            className="gap-3"
            logoClassName="size-6"
            textClassName="text-base font-playfair font-semibold"
          />
          <ThemeToggle />
        </div>

        <div className="flex grow items-center justify-center px-6 sm:px-10 lg:px-12">
          <AuthLoginForm
            isAuthenticating={isAuthenticating}
            statusMessage={unsupportedRoleMessage}
          />
        </div>
      </div>
    </div>
  );
}
