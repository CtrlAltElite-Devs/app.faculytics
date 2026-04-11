"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertCircle className="text-destructive size-10" />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">This page could not be loaded</h2>
        <p className="text-muted-foreground text-sm">
          Something interrupted the request. Try loading the page again.
        </p>
      </div>
      <Button variant="outline" onClick={reset}>
        Reload page
      </Button>
    </div>
  );
}
