import { QuestionnaireAsyncContent } from "@/features/questionnaires/components/questionnaire-async-content";
import { QuestionnaireBuilderShell } from "@/features/questionnaires/components/builder/questionnaire-builder-shell";
import type { QuestionnaireType } from "@/features/questionnaires/types";

type QuestionnaireBuilderScreenProps = {
  activeType: QuestionnaireType;
  isHydrated: boolean;
  isLoading: boolean;
  isError: boolean;
  emptyState?: {
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null;
  onRetry: () => void;
};

export function QuestionnaireBuilderScreen({
  activeType,
  isHydrated,
  isLoading,
  isError,
  emptyState,
  onRetry,
}: QuestionnaireBuilderScreenProps) {
  return (
    <QuestionnaireAsyncContent
      isLoading={isLoading}
      isError={isError}
      emptyState={emptyState}
      onRetry={onRetry}
    >
      <QuestionnaireBuilderShell activeType={activeType} isHydrated={isHydrated} />
    </QuestionnaireAsyncContent>
  );
}
