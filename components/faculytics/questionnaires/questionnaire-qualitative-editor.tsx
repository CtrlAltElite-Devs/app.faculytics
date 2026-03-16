"use client";

import { QuestionnaireAddActionButton } from "@/components/faculytics/questionnaires/questionnaire-add-action-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  QuestionnaireBuilderQualitativeConfig,
  QuestionnaireBuilderValidationIssue,
} from "@/types/questionnaires";

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
  const maxLength = value.maxLength ?? 1000;
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
    <Card id="qualitative-editor">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="min-w-0 flex-1">
          <CardTitle className="font-playfair text-lg font-semibold">Comments</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Please provide additional comments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="qualitative-required"
              checked={value.required}
              onCheckedChange={(checked) => onChange({ required: checked === true })}
            />
            <Label htmlFor="qualitative-required">Required response</Label>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onChange({ enabled: false })}
          >
            Remove section
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          disabled
          placeholder="Add your comments here."
          aria-required={value.required}
          maxLength={maxLength}
          className="min-h-28 bg-muted/20"
        />

        <div className="flex justify-end">
          <div className="w-full max-w-40 space-y-2">
            <Label htmlFor="qualitative-max-length" className="text-right">
              Maximum length
            </Label>
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
                  maxLength: event.target.value === "" ? 1000 : Number(event.target.value),
                })
              }
            />
            {maxLengthIssue && <p className="text-sm text-destructive">{maxLengthIssue.message}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
