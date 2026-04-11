"use client";

import { useSearchParams } from "next/navigation";

import { QuestionnaireFormRenderer } from "@/features/questionnaires/components/form/questionnaire-form-renderer";
import { QuestionnaireRatingScaleInstructions } from "@/features/questionnaires/components/questionnaire-rating-scale-instructions";
import { buildQuestionnairePreviewModel } from "@/features/questionnaires/lib/builder-serializer";
import { useQuestionnaireBuilderStore } from "@/features/questionnaires/store/questionnaire-builder-store";
import { resolveQuestionnaireType } from "@/features/questionnaires/types";

import { QuestionnairePreviewLoadingCard } from "../../_components/questionnaire-preview-loading-card";
import { QuestionnairePreviewShell } from "../../_components/questionnaire-preview-shell";
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
      <QuestionnairePreviewShell
        title="Loading preview"
        description="Preparing the current builder draft for preview."
        backHref={`/superadmin/questionnaires/new?type=${requestedType}`}
        backLabel="Back to builder"
      >
        <QuestionnairePreviewLoadingCard message="Loading the current draft preview..." />
      </QuestionnairePreviewShell>
    );
  }

  if (!draft || !hasPreviewContent) {
    return (
      <QuestionnairePreviewShell
        title="Preview unavailable"
        description="There is no draft available to preview yet. Return to the builder and add questionnaire content first."
        backHref={`/superadmin/questionnaires/new?type=${requestedType}`}
        backLabel="Back to builder"
      >
        <QuestionnairePreviewStateCard
          title="Preview unavailable"
          description="There is no draft available to preview yet. Return to the builder and add questionnaire content first."
        />
      </QuestionnairePreviewShell>
    );
  }

  const model = buildQuestionnairePreviewModel(draft);
  const backHref = `/superadmin/questionnaires/new?type=${requestedType}`;

  return (
    <QuestionnairePreviewShell
      title={model.title}
      description="Review the questionnaire structure and wording before saving or publishing."
      backHref={backHref}
      backLabel="Back to builder"
    >
      <div>
        <QuestionnaireRatingScaleInstructions />
      </div>

      <div>
        <QuestionnaireFormRenderer model={model} mode="preview" />
      </div>
    </QuestionnairePreviewShell>
  );
}
