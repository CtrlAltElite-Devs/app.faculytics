"use client";

import { Loader2 } from "lucide-react";

type DeanAnalyticsLoadingStateProps = {
  message?: string;
};

export function DeanAnalyticsLoadingState({
  message = "Loading analytics...",
}: DeanAnalyticsLoadingStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <p className="mt-3 font-sans text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
