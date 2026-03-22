"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type {
  QuestionnaireBuilderQualitativeConfig,
  QuestionnaireFormMode,
} from "@/features/questionnaires/types";

type QuestionnaireFormQualitativeProps = {
  config: QuestionnaireBuilderQualitativeConfig;
  mode: QuestionnaireFormMode;
  value: string;
  onChangeComment: (value: string) => void;
};

export function QuestionnaireFormQualitative({
  config,
  mode,
  value,
  onChangeComment,
}: QuestionnaireFormQualitativeProps) {
  const disabled = mode === "preview";
  const charCount = value.length;

  return (
    <Card className="gap-3">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="font-playfair text-lg">Comments</CardTitle>
          {config.required && <Badge variant="outline">Required</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Textarea
          disabled={disabled}
          placeholder="Add your comments here."
          aria-required={config.required}
          aria-label="Qualitative comments"
          maxLength={config.maxLength}
          value={value}
          onChange={(e) => onChangeComment(e.target.value)}
          rows={4}
        />
        {mode === "interactive" && (
          <p className="text-xs text-muted-foreground text-right">
            {charCount} / {config.maxLength}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
