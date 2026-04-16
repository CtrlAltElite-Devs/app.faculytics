"use client";

import { memo } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type {
  QuestionnaireBuilderQualitativeConfig,
  QuestionnaireFormMode,
} from "@/features/questionnaires/types";

import { useFormActions, useQualitativeComment } from "./questionnaire-form-store";

type QuestionnaireFormQualitativeProps = {
  config: QuestionnaireBuilderQualitativeConfig;
  mode: QuestionnaireFormMode;
};

function QuestionnaireFormQualitativeBase({ config, mode }: QuestionnaireFormQualitativeProps) {
  const value = useQualitativeComment();
  const { setComment } = useFormActions();
  const disabled = mode === "preview";
  const isInteractive = mode === "interactive";
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
          onChange={(e) => {
            if (!isInteractive) return;
            setComment(e.target.value);
          }}
          rows={4}
        />
        {isInteractive && (
          <p className="text-xs text-muted-foreground text-right">
            {charCount} / {config.maxLength}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export const QuestionnaireFormQualitative = memo(QuestionnaireFormQualitativeBase);
