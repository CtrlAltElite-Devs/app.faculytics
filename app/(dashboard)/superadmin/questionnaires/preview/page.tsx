"use client";

import { useSearchParams } from "next/navigation";

import { QuestionnaireFormRenderer } from "@/features/questionnaires/components/form/questionnaire-form-renderer";
import { QuestionnaireRatingScaleInstructions } from "@/features/questionnaires/components/questionnaire-rating-scale-instructions";
import { deserializeQuestionnaireVersionToDraft } from "@/features/questionnaires/lib/builder-deserializer";
import { buildQuestionnairePreviewModel } from "@/features/questionnaires/lib/builder-serializer";
import { useQuestionnaireVersion } from "@/features/questionnaires/hooks/use-questionnaire-versions";

import { QuestionnairePreviewLoadingCard } from "../_components/questionnaire-preview-loading-card";
import { QuestionnairePreviewShell } from "../_components/questionnaire-preview-shell";
import { QuestionnairePreviewStateCard } from "../_components/questionnaire-preview-state-card";

export default function QuestionnaireVersionPreviewPage() {
  const searchParams = useSearchParams();
  const versionId = searchParams.get("versionId");
  const versionQuery = useQuestionnaireVersion(versionId, {
    enabled: Boolean(versionId),
  });

  if (!versionId) {
    return (
      <QuestionnairePreviewShell
        backHref="/superadmin/questionnaires"
        backLabel="Back to questionnaires"
      >
        <QuestionnairePreviewStateCard
          title="Preview unavailable"
          description="No questionnaire version was selected for preview."
        />
      </QuestionnairePreviewShell>
    );
  }

  if (versionQuery.isLoading) {
    return (
      <QuestionnairePreviewShell
        title="Loading preview"
        description="Preparing the selected questionnaire version for preview."
        backHref="/superadmin/questionnaires"
        backLabel="Back to questionnaires"
      >
        <QuestionnairePreviewLoadingCard message="Loading the questionnaire preview..." />
      </QuestionnairePreviewShell>
    );
  }

  if (versionQuery.isError || !versionQuery.data) {
    return (
      <QuestionnairePreviewShell
        backHref="/superadmin/questionnaires"
        backLabel="Back to questionnaires"
      >
        <QuestionnairePreviewStateCard
          title="Preview unavailable"
          description="The selected questionnaire version could not be loaded."
        />
      </QuestionnairePreviewShell>
    );
  }

  const draft = {
    ...deserializeQuestionnaireVersionToDraft(versionQuery.data),
    hydratedFromServer: true,
  };
  const model = buildQuestionnairePreviewModel(draft);

  return (
    <QuestionnairePreviewShell
      title={model.title}
      description="Review the questionnaire structure, sections, and prompts before publishing."
      backHref="/superadmin/questionnaires"
      backLabel="Back to questionnaires"
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
