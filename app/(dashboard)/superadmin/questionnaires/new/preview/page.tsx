"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { QuestionnaireFormRenderer } from "@/features/questionnaires/components/form/questionnaire-form-renderer";
import { QuestionnaireRatingScaleInstructions } from "@/features/questionnaires/components/questionnaire-rating-scale-instructions";
import { buildQuestionnairePreviewModel } from "@/features/questionnaires/lib/builder-serializer";
import { useQuestionnaireBuilderStore } from "@/features/questionnaires/store/questionnaire-builder-store";
import {
  resolveQuestionnaireType,
} from "@/features/questionnaires/types";

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

  const model = buildQuestionnairePreviewModel(draft);
  const backHref = `/superadmin/questionnaires/new?type=${requestedType}`;

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
          <Link href={backHref}>Back to builder</Link>
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
