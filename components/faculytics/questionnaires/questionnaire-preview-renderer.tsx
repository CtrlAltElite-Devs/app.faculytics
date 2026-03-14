"use client";

import Link from "next/link";

import { QuestionnaireRatingScaleInstructions } from "@/components/faculytics/questionnaires/questionnaire-rating-scale-instructions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type {
  QuestionnaireBuilderPreviewModel,
  QuestionnaireBuilderPreviewSection,
} from "@/types/questionnaires";

const LIKERT_OPTIONS = [
  { label: "1", description: "Strongly disagree" },
  { label: "2", description: "Disagree" },
  { label: "3", description: "Neutral" },
  { label: "4", description: "Agree" },
  { label: "5", description: "Strongly agree" },
] as const;

function PreviewSection({ section }: { section: QuestionnaireBuilderPreviewSection }) {
  return (
    <div className="space-y-5 rounded-2xl border bg-background p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-playfair text-xl font-semibold">{section.title}</h3>
        {section.weight !== null && <Badge variant="outline">Weight {section.weight}</Badge>}
      </div>

      {section.children.length > 0 ? (
        <div className="space-y-4">
          {section.children.map((child) => (
            <PreviewSection key={child.id} section={child} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {section.questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <div className="space-y-1">
                <p className="font-medium">{question.prompt || "Untitled question"}</p>
                <p className="text-sm text-muted-foreground">
                  {question.type === "LIKERT_1_5"
                    ? "Students will answer on a 1 to 5 scale."
                    : "Students will answer yes or no."}
                </p>
              </div>

              {question.type === "LIKERT_1_5" ? (
                <RadioGroup className="grid gap-2 sm:grid-cols-5" value="">
                  {LIKERT_OPTIONS.map((option) => (
                    <Label
                      key={option.label}
                      className="flex items-center gap-3 rounded-xl border px-3 py-3"
                    >
                      <RadioGroupItem value={option.label} disabled />
                      <span className="text-sm">
                        <span className="font-medium">{option.label}</span>
                        <span className="ml-2 text-muted-foreground">{option.description}</span>
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              ) : (
                <RadioGroup className="grid gap-2 sm:grid-cols-2" value="">
                  {["Yes", "No"].map((option) => (
                    <Label
                      key={option}
                      className="flex items-center gap-3 rounded-xl border px-3 py-3"
                    >
                      <RadioGroupItem value={option} disabled />
                      <span className="text-sm font-medium">{option}</span>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function QuestionnairePreviewRenderer({
  model,
}: {
  model: QuestionnaireBuilderPreviewModel;
}) {
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold">{model.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Superadmin preview. This simulates the student reading experience without submission.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/superadmin/questionnaires/new?type=${model.type}`}>Back to builder</Link>
        </Button>
      </div>

      <QuestionnaireRatingScaleInstructions />

      <div className="space-y-5">
        {model.sections.map((section) => (
          <PreviewSection key={section.id} section={section} />
        ))}
      </div>

      {model.qualitative.enabled ? (
        <Card className="gap-3">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="font-playfair text-lg">Comments</CardTitle>
              {model.qualitative.required ? <Badge variant="outline">Required</Badge> : null}
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              disabled
              placeholder="Add your comments here."
              aria-required={model.qualitative.required}
              maxLength={model.qualitative.maxLength}
            />
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
