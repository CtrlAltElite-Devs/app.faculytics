import type { ReactNode } from "react";

import { QuestionnaireEmptyState } from "@/components/faculytics/questionnaires/questionnaire-empty-state";
import { QuestionnaireErrorState } from "@/components/faculytics/questionnaires/questionnaire-error-state";
import { QuestionnaireLoadingState } from "@/components/faculytics/questionnaires/questionnaire-loading-state";

type QuestionnaireAsyncContentProps = {
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

export function QuestionnaireAsyncContent({
  isLoading,
  isError,
  onRetry,
  emptyState,
  children,
}: QuestionnaireAsyncContentProps) {
  if (isLoading) {
    return <QuestionnaireLoadingState />;
  }

  if (isError) {
    return <QuestionnaireErrorState onRetry={onRetry} />;
  }

  if (emptyState) {
    return (
      <QuestionnaireEmptyState
        description={emptyState.description}
        actionLabel={emptyState.actionLabel}
        onAction={emptyState.onAction}
      />
    );
  }

  return <>{children}</>;
}
