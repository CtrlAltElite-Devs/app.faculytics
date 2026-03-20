"use client";
import { useSearchParams } from "next/navigation";

import { QuestionnaireStepper } from "@/features/questionnaires/components/questionnaire-stepper";
import { buildQuestionnairePreviewModel } from "@/features/questionnaires/lib/builder-serializer";
import { useQuestionnaireBuilderStore } from "@/features/questionnaires/store/questionnaire-builder-store";
import { resolveQuestionnaireType } from "@/features/questionnaires/types";

import { QuestionnairePreviewLoadingCard } from "../../_components/questionnaire-preview-loading-card";
import { QuestionnairePreviewStateCard } from "../../_components/questionnaire-preview-state-card";

export default function QuestionnaireBuilderPreviewPage() {
  const searchParams = useSearchParams();
  const requestedType = resolveQuestionnaireType(searchParams.get("type"));
  const hydrated = useQuestionnaireBuilderStore((state) => state.hydrated);
  const draft = useQuestionnaireBuilderStore((state) => state.drafts[requestedType] ?? null);
  const hasPreviewContent =
    draft !== null && (draft.sections.length > 0 || draft.qualitative.enabled);

  if (!hydrated) {
    return (
      <section className="space-y-4 px-4 py-5 sm:px-6 md:p-8">
        <QuestionnairePreviewLoadingCard message="Loading preview draft..." />
      </section>
    );
  }

  if (!draft || !hasPreviewContent) {
    return (
      <section className="space-y-4 px-4 py-5 sm:px-6 md:p-8">
        <QuestionnairePreviewStateCard
          title="Preview unavailable"
          description="There is no active builder draft to preview. Return to the questionnaire builder and start a draft first."
          backHref={`/superadmin/questionnaires/new?type=${requestedType}`}
          backLabel="Back to builder"
        />
      </section>
    );
  }

  return (
    <QuestionnaireStepper
      model={buildQuestionnairePreviewModel(draft)}
      mode="preview"
      allowFreeNavigation
      backHref={`/superadmin/questionnaires/new?type=${requestedType}`}
      backLabel="Back to builder"
    />
  );
}
