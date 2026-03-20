"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { QuestionnaireBuilderQualitativeConfig } from "@/features/questionnaires/types";

export type QuestionnaireStepQualitativeProps = {
  qualitative: QuestionnaireBuilderQualitativeConfig;
  mode?: "preview" | "response";
};

export function QuestionnaireStepQualitative({
  qualitative,
  mode = "preview",
}: QuestionnaireStepQualitativeProps) {
  return (
    <Card className="gap-3">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="font-playfair text-lg">Comments</CardTitle>
          {qualitative.required ? <Badge variant="outline">Required</Badge> : null}
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          disabled={mode === "preview"}
          placeholder="Add your comments here."
          aria-required={qualitative.required}
          maxLength={qualitative.maxLength}
        />
      </CardContent>
    </Card>
  );
}
