"use client";

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
  const titleIssue = issues.find(
    (issue) => issue.target.type === "qualitative" && issue.target.field === "title"
  );
  const descriptionIssue = issues.find(
    (issue) => issue.target.type === "qualitative" && issue.target.field === "description"
  );
  const placeholderIssue = issues.find(
    (issue) => issue.target.type === "qualitative" && issue.target.field === "placeholder"
  );

  if (!value.enabled) {
    return (
      <button
        type="button"
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-muted-foreground/40 px-5 py-8 text-center transition-colors hover:border-foreground/40 hover:bg-muted/30"
        onClick={() => onChange({ enabled: true })}
      >
        <span className="font-playfair text-lg">Add comment section</span>
      </button>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="font-playfair text-lg">Final comment section</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            This optional block renders after all quantitative sections.
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
        <div className="space-y-2">
          <Label htmlFor="qualitative-title">Section title</Label>
          <Input
            id="qualitative-title"
            value={value.title}
            aria-invalid={Boolean(titleIssue)}
            onChange={(event) => onChange({ title: event.target.value })}
          />
          {titleIssue && <p className="text-sm text-destructive">{titleIssue.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="qualitative-description">Section Description</Label>
          <Textarea
            id="qualitative-description"
            value={value.description}
            aria-invalid={Boolean(descriptionIssue)}
            onChange={(event) => onChange({ description: event.target.value })}
          />
          {descriptionIssue && (
            <p className="text-sm text-destructive">{descriptionIssue.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="qualitative-placeholder">Placeholder</Label>
          <Input
            id="qualitative-placeholder"
            value={value.placeholder}
            aria-invalid={Boolean(placeholderIssue)}
            onChange={(event) => onChange({ placeholder: event.target.value })}
          />
          {placeholderIssue && (
            <p className="text-sm text-destructive">{placeholderIssue.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
