"use client";

import { Loader2 } from "lucide-react";

import { AppBrand } from "@/components/layout/app-brand";

type AppLoadingScreenProps = {
  message?: string;
};

export function AppLoadingScreen({ message = "Loading your workspace..." }: AppLoadingScreenProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 bg-background/40 backdrop-blur-xl" />
      <div className="relative flex w-full max-w-sm flex-col items-center gap-5 text-center">
        <AppBrand
          className="flex-col gap-3"
          logoClassName="size-12"
          textClassName="text-xl font-semibold"
          priority
        />
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}
