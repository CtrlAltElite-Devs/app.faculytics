"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="font-playfair text-lg">Final comment section</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            This optional block renders after all quantitative sections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{value.enabled ? "Enabled" : "Optional"}</Badge>
          <Button
            type="button"
            variant={value.enabled ? "outline" : "default"}
            size="sm"
            onClick={() => onChange({ enabled: !value.enabled })}
          >
            {value.enabled ? "Disable" : "Enable"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!value.enabled ? (
          <div className="rounded-xl border border-dashed px-4 py-5 text-sm text-muted-foreground">
            Enable the final comment section if students should be able to leave qualitative
            feedback after the scored questions.
          </div>
        ) : (
          <>
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
              <Label htmlFor="qualitative-description">Helper text</Label>
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

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={value.required ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ required: !value.required })}
              >
                {value.required ? "Required response" : "Optional response"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
