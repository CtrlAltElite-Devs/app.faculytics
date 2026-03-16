"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { QuestionnairePreviewRenderer } from "@/components/faculytics/questionnaires/questionnaire-preview-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deserializeQuestionnaireVersionToDraft } from "@/lib/questionnaires/builder-deserializer";
import { buildQuestionnairePreviewModel } from "@/lib/questionnaires/builder-serializer";
import { useQuestionnaireVersion } from "@/hooks/questionnaires/use-questionnaire-versions";

export default function QuestionnaireVersionPreviewPage() {
  const searchParams = useSearchParams();
  const versionId = searchParams.get("versionId");
  const versionQuery = useQuestionnaireVersion(versionId, {
    enabled: Boolean(versionId),
  });

  if (!versionId) {
    return (
      <section className="space-y-4 px-4 py-5 sm:px-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-playfair text-xl">Preview unavailable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              No questionnaire version was selected for preview.
            </p>
            <Button asChild variant="outline">
              <Link href="/superadmin/questionnaires">Back to questionnaires</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (versionQuery.isLoading) {
    return (
      <section className="space-y-4 px-4 py-5 sm:px-6 md:p-8">
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Loading questionnaire preview...
          </CardContent>
        </Card>
      </section>
    );
  }

  if (versionQuery.isError || !versionQuery.data) {
    return (
      <section className="space-y-4 px-4 py-5 sm:px-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-playfair text-xl">Preview unavailable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The requested questionnaire version could not be loaded.
            </p>
            <Button asChild variant="outline">
              <Link href="/superadmin/questionnaires">Back to questionnaires</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const draft = {
    ...deserializeQuestionnaireVersionToDraft(versionQuery.data),
    hydratedFromServer: true,
  };

  return (
    <section className="space-y-6 px-4 py-5 sm:px-6 md:p-8">
      <QuestionnairePreviewRenderer
        model={buildQuestionnairePreviewModel(draft)}
        backHref="/superadmin/questionnaires"
        backLabel="Back to questionnaires"
      />
    </section>
  );
}
