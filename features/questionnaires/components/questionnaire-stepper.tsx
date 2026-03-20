"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  StepperIndicator,
  StepperNavigation,
  StepperProvider,
  useStepper,
} from "@/components/shared/stepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionnaireRatingScaleInstructions } from "@/features/questionnaires/components/questionnaire-rating-scale-instructions";
import { QuestionnaireStepQualitative } from "@/features/questionnaires/components/questionnaire-step-qualitative";
import { QuestionnaireStepSection } from "@/features/questionnaires/components/questionnaire-step-section";
import type {
  QuestionnaireBuilderPreviewModel,
  QuestionnaireBuilderPreviewQuestion,
  QuestionnaireBuilderPreviewSection,
} from "@/features/questionnaires/types";

type QuestionnaireStepperProps = {
  model: QuestionnaireBuilderPreviewModel;
  mode?: "preview" | "response";
  allowFreeNavigation?: boolean;
  backHref: string;
  backLabel: string;
  renderQuestion?: (
    question: QuestionnaireBuilderPreviewQuestion,
    defaultRender: ReactNode
  ) => ReactNode;
  initialStep?: number;
};

type QuestionnaireStepperFlowProps = {
  sections: QuestionnaireBuilderPreviewSection[];
  qualitativeEnabled: boolean;
  qualitative: QuestionnaireBuilderPreviewModel["qualitative"];
  steps: Array<{ label: string }>;
  mode: "preview" | "response";
  backHref: string;
  backLabel: string;
  renderQuestion?: (
    question: QuestionnaireBuilderPreviewQuestion,
    defaultRender: ReactNode
  ) => ReactNode;
  completedSteps: Set<number>;
  showCompletion: boolean;
  setShowCompletion: (value: boolean) => void;
};

function countQuestions(sections: QuestionnaireBuilderPreviewSection[]): number {
  return sections.reduce((total, section) => {
    if (section.children.length > 0) {
      return total + countQuestions(section.children);
    }

    return total + section.questions.length;
  }, 0);
}

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function QuestionnaireStepperFlow({
  sections,
  qualitativeEnabled,
  qualitative,
  steps,
  mode,
  backHref,
  backLabel,
  renderQuestion,
  completedSteps,
  showCompletion,
  setShowCompletion,
}: QuestionnaireStepperFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeStep } = useStepper();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const expectedStep = String(activeStep + 1);

    if (params.get("step") !== expectedStep) {
      params.set("step", expectedStep);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [activeStep, router, searchParams]);

  useEffect(() => {
    if (showCompletion) {
      return;
    }

    panelRef.current?.focus();
  }, [activeStep, showCompletion]);

  const showQualitativeStep = qualitativeEnabled && activeStep === sections.length;

  return (
    <div className="space-y-6">
      <StepperIndicator steps={steps} completedSteps={completedSteps} />

      {showCompletion ? (
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="font-playfair text-2xl">End of preview</CardTitle>
              <Badge variant="outline">Preview complete</Badge>
            </div>
            <CardDescription>
              This is how the questionnaire ends for students.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href={backHref}>{backLabel}</Link>
            </Button>
            <Button type="button" onClick={() => setShowCompletion(false)}>
              Back to last step
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div
            ref={panelRef}
            tabIndex={-1}
            role="tabpanel"
            aria-labelledby={`stepper-tab-${activeStep}`}
            className="rounded-2xl border bg-card p-5 outline-none sm:p-6"
          >
            {showQualitativeStep ? (
              <QuestionnaireStepQualitative qualitative={qualitative} mode={mode} />
            ) : (
              <QuestionnaireStepSection
                section={sections[activeStep] as QuestionnaireBuilderPreviewSection}
                isTopLevel
                mode={mode}
                renderQuestion={renderQuestion}
              />
            )}
          </div>

          <StepperNavigation onFinish={() => setShowCompletion(true)} />
        </>
      )}
    </div>
  );
}

export function QuestionnaireStepper({
  model,
  mode = "preview",
  allowFreeNavigation = true,
  backHref,
  backLabel,
  renderQuestion,
  initialStep,
}: QuestionnaireStepperProps) {
  const searchParams = useSearchParams();
  const sections = model.sections;
  const hasQualitativeStep = model.qualitative.enabled;
  const totalSteps = sections.length + (hasQualitativeStep ? 1 : 0);
  const parsedStep = Number.parseInt(searchParams.get("step") ?? "", 10);
  const stepFromUrl = Number.isNaN(parsedStep) ? 0 : parsedStep - 1;
  const resolvedInitialStep = initialStep ?? stepFromUrl;
  const clampedInitialStep =
    totalSteps > 0 ? Math.min(Math.max(resolvedInitialStep, 0), totalSteps - 1) : 0;
  const questionCount = countQuestions(sections);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(
    () => new Set<number>([clampedInitialStep])
  );
  const [showCompletion, setShowCompletion] = useState(false);

  const steps = [
    ...sections.map((section) => ({
      label: section.title || "Untitled section",
    })),
    ...(hasQualitativeStep ? [{ label: "Comments" }] : []),
  ];

  const renderSinglePageContent = () => (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="rounded-2xl border bg-card p-5 sm:p-6">
          <QuestionnaireStepSection
            section={section}
            isTopLevel
            mode={mode}
            renderQuestion={renderQuestion}
          />
        </div>
      ))}

      {hasQualitativeStep ? (
        <QuestionnaireStepQualitative qualitative={model.qualitative} mode={mode} />
      ) : null}
    </div>
  );

  return (
    <section className="space-y-8 px-4 py-5 sm:px-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div>
            <h1 className="font-playfair text-3xl font-bold">{model.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Superadmin preview. This simulates the student reading experience without
              submission.
            </p>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {`${pluralize(sections.length, "section", "sections")} · ${pluralize(questionCount, "question", "questions")}`}
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </div>

      <QuestionnaireRatingScaleInstructions />

      {totalSteps <= 1 ? (
        renderSinglePageContent()
      ) : (
        <StepperProvider
          totalSteps={totalSteps}
          initialStep={clampedInitialStep}
          allowFreeNavigation={allowFreeNavigation}
          onStepChange={(step) => {
            setVisitedSteps((currentSteps) => {
              if (currentSteps.has(step)) {
                return currentSteps;
              }

              const nextSteps = new Set(currentSteps);
              nextSteps.add(step);
              return nextSteps;
            });
            setShowCompletion(false);
          }}
        >
          <QuestionnaireStepperFlow
            sections={sections}
            qualitativeEnabled={hasQualitativeStep}
            qualitative={model.qualitative}
            steps={steps}
            mode={mode}
            backHref={backHref}
            backLabel={backLabel}
            renderQuestion={renderQuestion}
            completedSteps={visitedSteps}
            showCompletion={showCompletion}
            setShowCompletion={setShowCompletion}
          />
        </StepperProvider>
      )}
    </section>
  );
}
