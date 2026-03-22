"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { QuestionnaireFormRenderer } from "@/features/questionnaires/components/form/questionnaire-form-renderer";
import { QuestionnaireRatingScaleInstructions } from "@/features/questionnaires/components/questionnaire-rating-scale-instructions";
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
  const model = buildQuestionnairePreviewModel(draft);

  return (
    <section className="space-y-6 px-0 py-5 sm:px-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 px-4 sm:px-0">
        <div>
          <h1 className="font-playfair text-3xl font-bold">{model.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Superadmin preview. This simulates the student reading experience
            without submission.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/superadmin/questionnaires">Back to questionnaires</Link>
        </Button>
      </div>

      <div className="px-4 sm:px-0">
        <QuestionnaireRatingScaleInstructions />
      </div>

      <div className="px-4 sm:px-0">
        <QuestionnaireFormRenderer model={model} mode="preview" />
      </div>
    </section>
  );
}
