"use client";
import { useSearchParams } from "next/navigation";

import { QuestionnaireStepper } from "@/features/questionnaires/components/questionnaire-stepper";
import { deserializeQuestionnaireVersionToDraft } from "@/features/questionnaires/lib/builder-deserializer";
import { buildQuestionnairePreviewModel } from "@/features/questionnaires/lib/builder-serializer";
import { useQuestionnaireVersion } from "@/features/questionnaires/hooks/use-questionnaire-versions";

import { QuestionnairePreviewLoadingCard } from "../_components/questionnaire-preview-loading-card";
import { QuestionnairePreviewStateCard } from "../_components/questionnaire-preview-state-card";

export default function QuestionnaireVersionPreviewPage() {
  const searchParams = useSearchParams();
  const versionId = searchParams.get("versionId");
  const versionQuery = useQuestionnaireVersion(versionId, {
    enabled: Boolean(versionId),
  });

  if (!versionId) {
    return (
      <section className="space-y-4 px-4 py-5 sm:px-6 md:p-8">
        <QuestionnairePreviewStateCard
          title="Preview unavailable"
          description="No questionnaire version was selected for preview."
          backHref="/superadmin/questionnaires"
          backLabel="Back to questionnaires"
        />
      </section>
    );
  }

  if (versionQuery.isLoading) {
    return (
      <section className="space-y-4 px-4 py-5 sm:px-6 md:p-8">
        <QuestionnairePreviewLoadingCard message="Loading questionnaire preview..." />
      </section>
    );
  }

  if (versionQuery.isError || !versionQuery.data) {
    return (
      <section className="space-y-4 px-4 py-5 sm:px-6 md:p-8">
        <QuestionnairePreviewStateCard
          title="Preview unavailable"
          description="The requested questionnaire version could not be loaded."
          backHref="/superadmin/questionnaires"
          backLabel="Back to questionnaires"
        />
      </section>
    );
  }

  const draft = {
    ...deserializeQuestionnaireVersionToDraft(versionQuery.data),
    hydratedFromServer: true,
  };

  return (
    <QuestionnaireStepper
      model={buildQuestionnairePreviewModel(draft)}
      mode="preview"
      allowFreeNavigation
      backHref="/superadmin/questionnaires"
      backLabel="Back to questionnaires"
    />
  );
}
