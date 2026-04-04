import type { ReactNode } from "react";

import { DeanAnalyticsEmptyState } from "@/features/faculty-analytics/components/dean-analytics-empty-state";
import { DeanAnalyticsErrorState } from "@/features/faculty-analytics/components/dean-analytics-error-state";
import { DeanAnalyticsLoadingState } from "@/features/faculty-analytics/components/dean-analytics-loading-state";

type DeanAnalyticsAsyncContentProps = {
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

export function DeanAnalyticsAsyncContent({
  isLoading,
  isError,
  onRetry,
  loadingMessage,
  errorMessage,
  emptyState,
  children,
}: DeanAnalyticsAsyncContentProps) {
  if (isLoading) {
    return <DeanAnalyticsLoadingState message={loadingMessage} />;
  }

  if (isError) {
    return <DeanAnalyticsErrorState onRetry={onRetry} message={errorMessage} />;
  }

  if (emptyState) {
    return (
      <DeanAnalyticsEmptyState
        description={emptyState.description}
        actionLabel={emptyState.actionLabel}
        onAction={emptyState.onAction}
      />
    );
  }

  return <>{children}</>;
}
