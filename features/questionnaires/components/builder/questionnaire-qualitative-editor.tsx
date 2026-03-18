"use client";

import { Trash2 } from "lucide-react";

import { QuestionnaireAddActionButton } from "@/features/questionnaires/components/builder/questionnaire-add-action-button";
import { DEFAULT_QUALITATIVE_MAX_LENGTH } from "@/features/questionnaires/constants/builder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  QuestionnaireBuilderQualitativeConfig,
  QuestionnaireBuilderValidationIssue,
} from "@/features/questionnaires/types";

type QuestionnaireQualitativeEditorProps = {
  value: QuestionnaireBuilderQualitativeConfig;
  issues: QuestionnaireBuilderValidationIssue[];
  onChange: (updates: Partial<QuestionnaireBuilderQualitativeConfig>) => void;
};

export function QuestionnaireQualitativeEditor({
  value,
  issues,
  onChange,
}: QuestionnaireQualitativeEditorProps) {
  const maxLength = value.maxLength ?? DEFAULT_QUALITATIVE_MAX_LENGTH;
  const maxLengthIssue = issues.find(
    (issue) => issue.target.type === "qualitative" && issue.target.field === "maxLength"
  );

  if (!value.enabled) {
    return (
      <QuestionnaireAddActionButton
        label="Add Comment Section"
        onClick={() => onChange({ enabled: true })}
      />
    );
  }

  return (
    <Card id="qualitative-editor" className="min-w-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-3">
        <div className="min-w-0 flex-1">
          <CardTitle className="font-playfair text-lg font-semibold">Comments</CardTitle>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <Checkbox
              id="qualitative-required"
              checked={value.required}
              onCheckedChange={(checked) => onChange({ required: checked === true })}
            />
            <Label htmlFor="qualitative-required">Required response</Label>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-9 p-0"
            aria-label="Remove comment section"
            onClick={() => onChange({ enabled: false })}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="order-2 rounded-xl border bg-muted/20 px-4 py-3 sm:order-1">
          <p className="text-sm text-muted-foreground">
            The comment field is rendered in the student preview only.
          </p>
        </div>
        <div className="order-1 flex flex-col gap-4 sm:order-2 sm:flex-row sm:items-start sm:justify-end">
          <div className="flex items-center gap-2 sm:hidden">
            <Checkbox
              id="qualitative-required-mobile"
              checked={value.required}
              onCheckedChange={(checked) => onChange({ required: checked === true })}
            />
            <Label htmlFor="qualitative-required-mobile">Required response</Label>
          </div>
          <div className="w-full space-y-2 sm:w-36">
            <Input
              id="qualitative-max-length"
              type="number"
              min={1}
              max={5000}
              step={1}
              value={maxLength}
              aria-invalid={Boolean(maxLengthIssue)}
              onChange={(event) =>
                onChange({
                  maxLength:
                    event.target.value === ""
                      ? DEFAULT_QUALITATIVE_MAX_LENGTH
                      : Number(event.target.value),
                })
              }
            />
            <Label htmlFor="qualitative-max-length" className="text-xs text-muted-foreground">
              Maximum length
            </Label>
          </div>
        </div>
        {maxLengthIssue && <p className="text-sm text-destructive">{maxLengthIssue.message}</p>}
      </CardContent>
    </Card>
  );
}
