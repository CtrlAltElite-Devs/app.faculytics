import type { ReactNode } from "react";

import { ScopedAnalyticsEmptyState } from "@/features/faculty-analytics/components/scoped-analytics-empty-state";
import { ScopedAnalyticsErrorState } from "@/features/faculty-analytics/components/scoped-analytics-error-state";
import { ScopedAnalyticsLoadingState } from "@/features/faculty-analytics/components/scoped-analytics-loading-state";

type ScopedAnalyticsAsyncContentProps = {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  loadingMessage?: string;
  errorMessage?: string;
  emptyState?: {
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null;
  children: ReactNode;
};

export function ScopedAnalyticsAsyncContent({
  isLoading,
  isError,
  onRetry,
  loadingMessage,
  errorMessage,
  emptyState,
  children,
}: ScopedAnalyticsAsyncContentProps) {
  if (isLoading) {
    return <ScopedAnalyticsLoadingState message={loadingMessage} />;
  }

  if (isError) {
    return <ScopedAnalyticsErrorState onRetry={onRetry} message={errorMessage} />;
  }

  if (emptyState) {
    return (
      <ScopedAnalyticsEmptyState
        description={emptyState.description}
        actionLabel={emptyState.actionLabel}
        onAction={emptyState.onAction}
      />
    );
  }

  return <>{children}</>;
}
