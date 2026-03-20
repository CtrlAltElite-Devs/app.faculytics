"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MAX_SECTION_NESTING_LEVEL } from "@/features/questionnaires/constants/builder";
import { QuestionnaireStepQuestion } from "@/features/questionnaires/components/questionnaire-step-question";
import type {
  QuestionnaireBuilderPreviewQuestion,
  QuestionnaireBuilderPreviewSection,
} from "@/features/questionnaires/types";

type QuestionnaireStepSectionProps = {
  section: QuestionnaireBuilderPreviewSection;
  isTopLevel?: boolean;
  mode?: "preview" | "response";
  renderQuestion?: (
    question: QuestionnaireBuilderPreviewQuestion,
    defaultRender: ReactNode
  ) => ReactNode;
  depth?: number;
};

function SectionHeading({
  title,
  weight,
  as: Tag,
}: {
  title: string;
  weight: number | null;
  as: "h2" | "h3";
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag
        className={
          Tag === "h2" ? "font-playfair text-3xl font-bold" : "font-playfair text-xl font-semibold"
        }
      >
        {title}
      </Tag>
      {weight !== null ? <Badge variant="outline">Weight {weight}</Badge> : null}
    </div>
  );
}

export function QuestionnaireStepSection({
  section,
  isTopLevel = false,
  mode = "preview",
  renderQuestion,
  depth = 0,
}: QuestionnaireStepSectionProps) {
  if (depth > MAX_SECTION_NESTING_LEVEL) {
    return null;
  }

  const content =
    section.children.length > 0 ? (
      <div className="space-y-4">
        {section.children.map((child) => (
          <QuestionnaireStepSection
            key={child.id}
            section={child}
            mode={mode}
            renderQuestion={renderQuestion}
            depth={depth + 1}
          />
        ))}
      </div>
    ) : section.questions.length > 0 ? (
      <div className="space-y-6">
        {section.questions.map((question) => {
          const defaultRender = (
            <QuestionnaireStepQuestion
              key={question.id}
              question={question}
              disabled={mode === "preview"}
            />
          );

          return (
            <div key={question.id}>
              {renderQuestion ? renderQuestion(question, defaultRender) : defaultRender}
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">No questions added to this section yet.</p>
    );

  if (isTopLevel) {
    return (
      <div className="space-y-6">
        <SectionHeading title={section.title} weight={section.weight} as="h2" />
        {content}
      </div>
    );
  }

  return (
    <Card className="gap-4 rounded-2xl">
      <CardHeader>
        <SectionHeading title={section.title} weight={section.weight} as="h3" />
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
