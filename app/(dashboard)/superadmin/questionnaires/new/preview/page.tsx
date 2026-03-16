"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { QuestionnairePreviewRenderer } from "@/components/faculytics/questionnaires/questionnaire-preview-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildQuestionnairePreviewModel } from "@/lib/questionnaires/builder-serializer";
import { useQuestionnaireBuilderStore } from "@/stores/questionnaire-builder-store";
import {
  DEFAULT_QUESTIONNAIRE_TYPE,
  QUESTIONNAIRE_TYPES,
  type QuestionnaireType,
} from "@/types/questionnaires";

function resolveRequestedType(value: string | null): QuestionnaireType {
  if (value && QUESTIONNAIRE_TYPES.includes(value as QuestionnaireType)) {
    return value as QuestionnaireType;
  }

  return DEFAULT_QUESTIONNAIRE_TYPE;
}

export default function QuestionnaireBuilderPreviewPage() {
  const searchParams = useSearchParams();
  const requestedType = resolveRequestedType(searchParams.get("type"));
  const hydrated = useQuestionnaireBuilderStore((state) => state.hydrated);
  const draft = useQuestionnaireBuilderStore((state) => state.drafts[requestedType] ?? null);
  const hasPreviewContent =
    draft !== null && (draft.sections.length > 0 || draft.qualitative.enabled);

  if (!hydrated) {
    return (
      <section className="space-y-4 px-4 py-5 sm:px-6 md:p-8">
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Loading preview draft...
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!draft || !hasPreviewContent) {
    return (
      <section className="space-y-4 px-4 py-5 sm:px-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-playfair text-xl">Preview unavailable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              There is no active builder draft to preview. Return to the questionnaire builder and
              start a draft first.
            </p>
            <Button asChild variant="outline">
              <Link href={`/superadmin/questionnaires/new?type=${requestedType}`}>Back to builder</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6 px-0 py-5 sm:px-6 md:p-8">
      <QuestionnairePreviewRenderer model={buildQuestionnairePreviewModel(draft)} />
    </section>
  );
}
