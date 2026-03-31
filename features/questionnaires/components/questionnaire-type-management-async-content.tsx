import type { ReactNode } from "react";

import { QuestionnaireTypeManagementEmptyState } from "@/features/questionnaires/components/questionnaire-type-management-empty-state";
import { QuestionnaireTypeManagementErrorState } from "@/features/questionnaires/components/questionnaire-type-management-error-state";
import { QuestionnaireTypeManagementLoadingState } from "@/features/questionnaires/components/questionnaire-type-management-loading-state";

type QuestionnaireTypeManagementAsyncContentProps = {
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

export function QuestionnaireTypeManagementAsyncContent({
  isLoading,
  isError,
  onRetry,
  emptyState,
  children,
}: QuestionnaireTypeManagementAsyncContentProps) {
  if (isLoading) {
    return <QuestionnaireTypeManagementLoadingState />;
  }

  if (isError) {
    return <QuestionnaireTypeManagementErrorState onRetry={onRetry} />;
  }

  if (emptyState) {
    return (
      <QuestionnaireTypeManagementEmptyState
        description={emptyState.description}
        actionLabel={emptyState.actionLabel}
        onAction={emptyState.onAction}
      />
    );
  }

  return <>{children}</>;
}
