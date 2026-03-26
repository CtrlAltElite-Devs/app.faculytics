import type { ReactNode } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type DimensionAsyncContentProps = {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  emptyState?: {
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null;
  children: ReactNode;
};

export function DimensionAsyncContent({
  isLoading,
  isError,
  onRetry,
  emptyState,
  children,
}: DimensionAsyncContentProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Loading dimensions...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
        <p className="max-w-xl text-sm text-muted-foreground">Unable to load dimensions.</p>
        <Button type="button" variant="outline" className="mt-5" onClick={onRetry}>
          Retry
        </Button>
      </div>
    );
  }

  if (emptyState) {
    return (
      <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
        <p className="max-w-xl text-sm text-muted-foreground">{emptyState.description}</p>
        {emptyState.actionLabel && emptyState.onAction ? (
          <Button
            type="button"
            variant="brand"
            size="sm"
            className="mt-5"
            onClick={emptyState.onAction}
          >
            {emptyState.actionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  return <>{children}</>;
}
