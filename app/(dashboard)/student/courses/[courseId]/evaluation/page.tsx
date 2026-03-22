"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/hooks/use-me";
import { QuestionnaireFormRenderer } from "@/features/questionnaires/components/form/questionnaire-form-renderer";
import { QuestionnaireRatingScaleInstructions } from "@/features/questionnaires/components/questionnaire-rating-scale-instructions";
import { useEvaluationData } from "@/features/questionnaires/hooks/use-evaluation-data";
import { useAutoSaveDraft } from "@/features/questionnaires/hooks/use-save-draft";
import { useSubmitEvaluation } from "@/features/questionnaires/hooks/use-submit-evaluation";
import type { QuestionnaireFormValues } from "@/features/questionnaires/types";

import { EvaluationAlreadySubmitted } from "./_components/evaluation-already-submitted";
import { EvaluationNoFaculty } from "./_components/evaluation-no-faculty";
import { EvaluationPageShell } from "./_components/evaluation-page-shell";
import {
  EvaluationError,
  EvaluationLoading,
} from "./_components/evaluation-states";

export default function FacultyEvaluationPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const result = useEvaluationData(courseId);

  // --- Guard states (non-ready) ---

  if (result.status === "loading") {
    const ctx = result.context;
    return (
      <EvaluationPageShell
        courseName={ctx?.courseName}
        courseShortname={ctx?.courseShortname}
        facultyName={ctx?.facultyName}
      >
        <EvaluationLoading message={result.message} />
      </EvaluationPageShell>
    );
  }

  if (result.status === "error") {
    return (
      <EvaluationPageShell>
        <EvaluationError message={result.message} />
      </EvaluationPageShell>
    );
  }

  if (result.status === "no-faculty") {
    return (
      <EvaluationPageShell>
        <EvaluationNoFaculty />
      </EvaluationPageShell>
    );
  }

  if (result.status === "no-semester") {
    return (
      <EvaluationPageShell>
        <EvaluationError message="Unable to determine the current semester for this course." />
      </EvaluationPageShell>
    );
  }

  if (result.status === "no-version") {
    const { courseName, courseShortname, facultyName } = result.context;
    return (
      <EvaluationPageShell courseName={courseName} courseShortname={courseShortname} facultyName={facultyName}>
        <EvaluationError message="No active questionnaire is available for evaluation at this time." />
      </EvaluationPageShell>
    );
  }

  if (result.status === "already-submitted") {
    const { context, submittedAt } = result;
    return (
      <EvaluationPageShell courseName={context.courseName} courseShortname={context.courseShortname} facultyName={context.facultyName}>
        <EvaluationAlreadySubmitted submittedAt={submittedAt} />
      </EvaluationPageShell>
    );
  }

  // --- Ready state ---
  return <EvaluationForm courseId={courseId} {...result.data} />;
}

// ---------------------------------------------------------------------------
// Form section — only renders when all data is ready
// ---------------------------------------------------------------------------

type EvaluationFormProps = {
  courseId: string;
  courseName: string;
  courseShortname: string;
  facultyName: string;
  activeVersion: { id: string };
  faculty: { id: string };
  semester: { id: string };
  model: Parameters<typeof QuestionnaireFormRenderer>[0]["model"];
  defaultValues: Partial<QuestionnaireFormValues> | undefined;
};

function EvaluationForm({
  courseId,
  courseName,
  courseShortname,
  facultyName,
  activeVersion,
  faculty,
  semester,
  model,
  defaultValues,
}: EvaluationFormProps) {
  const formValuesRef = useRef<QuestionnaireFormValues | null>(null);
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const meQuery = useMe();
  const submitMutation = useSubmitEvaluation();

  const { debouncedSave, cancel: cancelAutoSave } = useAutoSaveDraft({
    versionId: activeVersion.id,
    facultyId: faculty.id,
    semesterId: semester.id,
    courseId,
    onStatusChange: setDraftStatus,
  });

  const handleChange = useCallback(
    (values: QuestionnaireFormValues) => {
      formValuesRef.current = values;
      debouncedSave(values);
    },
    [debouncedSave],
  );

  const handleSubmit = useCallback(() => {
    const values = formValuesRef.current;
    if (!values) return;

    const respondentId = meQuery.data?.id;
    if (!respondentId) {
      toast.error("Unable to identify your account. Please try again.");
      return;
    }

    // Validate required questions
    const requiredIds = model.sections.flatMap(collectRequiredIds);
    const unanswered = requiredIds.filter((id) => !(id in values.answers));

    if (unanswered.length > 0) {
      toast.error(`Please answer all required questions. ${unanswered.length} remaining.`);
      return;
    }

    if (model.qualitative.enabled && model.qualitative.required && !values.qualitativeComment.trim()) {
      toast.error("Please provide your comments before submitting.");
      return;
    }

    cancelAutoSave();
    submitMutation.mutate({
      versionId: activeVersion.id,
      respondentId,
      facultyId: faculty.id,
      semesterId: semester.id,
      courseId,
      answers: values.answers,
      qualitativeComment: values.qualitativeComment || undefined,
    });
  }, [activeVersion.id, faculty.id, semester.id, courseId, meQuery.data?.id, model, cancelAutoSave, submitMutation]);

  return (
    <EvaluationPageShell courseName={courseName} courseShortname={courseShortname} facultyName={facultyName}>
      <div className="mt-8">
        <QuestionnaireRatingScaleInstructions />
      </div>

      <div className="mt-8">
        <QuestionnaireFormRenderer
          key={defaultValues ? "hydrated" : "fresh"}
          model={model}
          mode="interactive"
          defaultValues={defaultValues}
          onChange={handleChange}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {draftStatus === "saving" && "Saving draft..."}
          {draftStatus === "saved" && "Draft saved"}
          {draftStatus === "error" && "Draft save failed"}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/student/courses">Back to Courses</Link>
          </Button>
          <Button variant="brand" onClick={handleSubmit} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Evaluation"
            )}
          </Button>
        </div>
      </div>
    </EvaluationPageShell>
  );
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function collectRequiredIds(
  section: { questions: { id: string; required: boolean }[]; children: typeof section[] },
): string[] {
  if (section.questions.length > 0) {
    return section.questions.filter((q) => q.required).map((q) => q.id);
  }
  return section.children.flatMap(collectRequiredIds);
}
