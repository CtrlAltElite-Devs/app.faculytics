"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMe } from "@/features/auth/hooks/use-me";
import { useMyEnrollments } from "@/features/enrollments/hooks/use-my-enrollments";
import { QuestionnaireFormRenderer } from "@/features/questionnaires/components/form/questionnaire-form-renderer";
import { QuestionnaireRatingScaleInstructions } from "@/features/questionnaires/components/questionnaire-rating-scale-instructions";
import { useActiveQuestionnaireVersion } from "@/features/questionnaires/hooks/use-active-questionnaire-version";
import { useCheckSubmission } from "@/features/questionnaires/hooks/use-check-submission";
import { useEvaluationDraft } from "@/features/questionnaires/hooks/use-evaluation-draft";
import { useAutoSaveDraft } from "@/features/questionnaires/hooks/use-save-draft";
import { useSubmitEvaluation } from "@/features/questionnaires/hooks/use-submit-evaluation";
import { deserializeQuestionnaireVersionToDraft } from "@/features/questionnaires/lib/builder-deserializer";
import { buildQuestionnairePreviewModel } from "@/features/questionnaires/lib/builder-serializer";
import { deleteDraft } from "@/features/questionnaires/api/questionnaire.requests";
import type { QuestionnaireFormValues } from "@/features/questionnaires/types";
import { decodeHtmlEntities } from "@/lib/string";
import { useSelectedCourseStore } from "@/stores/selected-course-store";
import { toast } from "sonner";

import { EvaluationAlreadySubmitted } from "./_components/evaluation-already-submitted";
import { EvaluationNoFaculty } from "./_components/evaluation-no-faculty";

function EvaluationLoading({ message }: { message: string }) {
  return (
    <Card className="mt-8">
      <CardContent className="flex min-h-48 flex-col items-center justify-center gap-2">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

function EvaluationError({ message }: { message: string }) {
  return (
    <Card className="mt-8">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-sm text-destructive">{message}</p>
        <Button asChild variant="outline">
          <Link href="/student/courses">Back to Courses</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function FacultyEvaluationPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;

  // --- 1. Resolve enrollment context (store-first, API-fallback) ---
  const selectedCourseFromStore = useSelectedCourseStore(
    (state) => state.selectedCourse,
  );
  const hasStoreMatch = selectedCourseFromStore?.course.id === courseId;
  const enrollmentsQuery = useMyEnrollments(
    { page: 1, limit: 100 },
    { enabled: !hasStoreMatch },
  );

  const enrollment = hasStoreMatch
    ? selectedCourseFromStore
    : enrollmentsQuery.data?.data.find((e) => e.course.id === courseId);

  const enrollmentLoading = !hasStoreMatch && enrollmentsQuery.isLoading;
  const enrollmentError = !hasStoreMatch && enrollmentsQuery.isError;

  const faculty = enrollment?.faculty;
  const semester = enrollment?.semester;
  const courseName = decodeHtmlEntities(
    enrollment?.course.fullname || "Course",
  );
  const courseShortname = decodeHtmlEntities(
    enrollment?.course.shortname || "",
  );
  const facultyName = decodeHtmlEntities(faculty?.fullName || "");

  // --- 2. Fetch active FACULTY_FEEDBACK version (full detail with schema) ---
  const activeVersionQuery = useActiveQuestionnaireVersion("FACULTY_FEEDBACK", {
    enabled: Boolean(enrollment) && Boolean(faculty) && Boolean(semester),
  });
  const activeVersion = activeVersionQuery.data;

  // --- 3. Check if already submitted ---
  const checkParams =
    activeVersion && faculty && semester
      ? {
          versionId: activeVersion.id,
          facultyId: faculty.id,
          semesterId: semester.id,
          courseId,
        }
      : null;

  const submissionCheck = useCheckSubmission(checkParams);

  // --- 4. Fetch existing draft ---
  const draftParams =
    activeVersion && faculty && semester
      ? {
          versionId: activeVersion.id,
          facultyId: faculty.id,
          semesterId: semester.id,
          courseId,
        }
      : null;

  const draftQuery = useEvaluationDraft(draftParams, {
    enabled:
      Boolean(draftParams) &&
      submissionCheck.isSuccess &&
      !submissionCheck.data?.submitted,
  });

  // --- 5. Build the preview model ---
  const model = activeVersion
    ? buildQuestionnairePreviewModel({
        ...deserializeQuestionnaireVersionToDraft(activeVersion),
        hydratedFromServer: true,
      })
    : null;

  // Handle stale draft (version mismatch)
  const draft = draftQuery.data;
  const isDraftStale =
    draft && activeVersion && draft.versionId !== activeVersion.id;

  // Delete stale draft on detection
  const staleDeletedRef = useRef(false);
  if (isDraftStale && !staleDeletedRef.current) {
    staleDeletedRef.current = true;
    void deleteDraft(draft.id);
  }

  const defaultValues =
    draft && !isDraftStale
      ? {
          answers: draft.answers,
          qualitativeComment: draft.qualitativeComment ?? "",
        }
      : undefined;

  // --- 6. Form state + submission ---
  const formValuesRef = useRef<QuestionnaireFormValues | null>(null);
  const [draftSaveStatus, setDraftSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const meQuery = useMe();
  const submitMutation = useSubmitEvaluation();

  const { debouncedSave, cancel: cancelAutoSave } = useAutoSaveDraft({
    versionId: activeVersion?.id ?? "",
    facultyId: faculty?.id ?? "",
    semesterId: semester?.id ?? "",
    courseId,
    onStatusChange: setDraftSaveStatus,
  });

  const handleChange = useCallback(
    (values: QuestionnaireFormValues) => {
      formValuesRef.current = values;
      if (activeVersion && faculty && semester) {
        debouncedSave(values);
      }
    },
    [activeVersion, faculty, semester, debouncedSave],
  );

  const handleSubmit = () => {
    if (!formValuesRef.current || !activeVersion || !faculty || !semester) return;

    const respondentId = meQuery.data?.id;
    if (!respondentId) {
      toast.error("Unable to identify your account. Please try again.");
      return;
    }

    if (!model) return;

    // Validate all required questions answered
    const { answers, qualitativeComment } = formValuesRef.current;
    const allQuestionIds = collectAllRequiredQuestionIds(model.sections);
    const unanswered = allQuestionIds.filter((id) => !(id in answers));

    if (unanswered.length > 0) {
      toast.error(
        `Please answer all required questions. ${unanswered.length} remaining.`,
      );
      return;
    }

    if (
      model.qualitative.enabled &&
      model.qualitative.required &&
      !qualitativeComment.trim()
    ) {
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
      answers,
      qualitativeComment: qualitativeComment || undefined,
    });
  };

  // --- Render ---

  // Enrollment loading/error states
  if (enrollmentLoading) {
    return (
      <PageShell>
        <EvaluationLoading message="Loading course context..." />
      </PageShell>
    );
  }

  if (enrollmentError || !enrollment) {
    return (
      <PageShell>
        <EvaluationError message="This course is not in your current enrollments." />
      </PageShell>
    );
  }

  // No faculty assigned
  if (!faculty) {
    return (
      <PageShell>
        <EvaluationNoFaculty />
      </PageShell>
    );
  }

  // No semester
  if (!semester) {
    return (
      <PageShell>
        <EvaluationError message="Unable to determine the current semester for this course." />
      </PageShell>
    );
  }

  // Active version loading
  if (activeVersionQuery.isLoading) {
    return (
      <PageShell courseName={courseName} courseShortname={courseShortname} facultyName={facultyName}>
        <EvaluationLoading message="Loading questionnaire..." />
      </PageShell>
    );
  }

  if (!activeVersion || !model) {
    return (
      <PageShell courseName={courseName} courseShortname={courseShortname} facultyName={facultyName}>
        <EvaluationError message="No active questionnaire is available for evaluation at this time." />
      </PageShell>
    );
  }

  // Already submitted
  if (submissionCheck.data?.submitted) {
    return (
      <PageShell courseName={courseName} courseShortname={courseShortname} facultyName={facultyName}>
        <EvaluationAlreadySubmitted
          submittedAt={submissionCheck.data.submittedAt}
        />
      </PageShell>
    );
  }

  // Submission check or draft still loading
  if (submissionCheck.isLoading || draftQuery.isLoading) {
    return (
      <PageShell courseName={courseName} courseShortname={courseShortname} facultyName={facultyName}>
        <EvaluationLoading message="Preparing your evaluation..." />
      </PageShell>
    );
  }

  // --- Main form ---
  return (
    <PageShell courseName={courseName} courseShortname={courseShortname} facultyName={facultyName}>
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
        <div className="text-xs text-muted-foreground">
          {draftSaveStatus === "saving" && "Saving draft..."}
          {draftSaveStatus === "saved" && "Draft saved"}
          {draftSaveStatus === "error" && "Draft save failed"}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/student/courses">Back to Courses</Link>
          </Button>
          <Button
            variant="brand"
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
          >
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
    </PageShell>
  );
}

// --- Helper components ---

function PageShell({
  children,
  courseName,
  courseShortname,
  facultyName,
}: {
  children: React.ReactNode;
  courseName?: string;
  courseShortname?: string;
  facultyName?: string;
}) {
  return (
    <section className="px-4 py-5 sm:px-6 md:px-16 md:py-12">
      <h1 className="font-playfair text-3xl font-bold">
        Faculty Evaluation Questionnaire
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your honest feedback helps improve the quality of education.
      </p>

      {courseName && facultyName && (
        <Card className="mt-8">
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Instructor
              </p>
              <p className="mt-2 font-playfair text-lg font-semibold">
                {facultyName}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Course
              </p>
              <p className="mt-2 text-lg font-semibold">{courseName}</p>
              {courseShortname && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {courseShortname}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {children}
    </section>
  );
}

// --- Utility ---

function collectAllRequiredQuestionIds(
  sections: { questions: { id: string; required: boolean }[]; children: typeof sections }[],
): string[] {
  return sections.flatMap((section) => {
    if (section.questions.length > 0) {
      return section.questions.filter((q) => q.required).map((q) => q.id);
    }
    return collectAllRequiredQuestionIds(section.children);
  });
}
