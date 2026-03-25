"use client";

import { useEffect, useMemo, useRef } from "react";

import { useMyEnrollments } from "@/features/enrollments/hooks/use-my-enrollments";
import { deleteDraft } from "@/features/questionnaires/api/questionnaire.requests";
import { deserializeQuestionnaireVersionToDraft } from "@/features/questionnaires/lib/builder-deserializer";
import { buildQuestionnairePreviewModel } from "@/features/questionnaires/lib/builder-serializer";
import type {
  QuestionnaireBuilderPreviewModel,
  QuestionnaireFormValues,
  QuestionnaireVersionDetail,
} from "@/features/questionnaires/types";
import type {
  EnrollmentResponseDto,
  FacultyShortResponseDto,
  SemesterShortResponseDto,
} from "@/features/enrollments/types";
import { decodeHtmlEntities } from "@/lib/string";
import { useSelectedCourseStore } from "@/stores/selected-course-store";

import { useActiveQuestionnaireVersion } from "./use-active-questionnaire-version";
import { useCheckSubmission } from "./use-check-submission";
import { useEvaluationDraft } from "./use-evaluation-draft";

// ---------------------------------------------------------------------------
// Return types — discriminated union so the page can switch on `status`
// ---------------------------------------------------------------------------

type EvaluationContext = {
  faculty: FacultyShortResponseDto;
  semester: SemesterShortResponseDto;
  courseName: string;
  courseShortname: string;
  facultyName: string;
  enrollmentSectionName?: string;
};

type ReadyData = EvaluationContext & {
  activeVersion: QuestionnaireVersionDetail;
  model: QuestionnaireBuilderPreviewModel;
  defaultValues: Partial<QuestionnaireFormValues> | undefined;
};

export type EvaluationDataResult =
  | { status: "loading"; message: string; context?: EvaluationContext }
  | { status: "error"; message: string }
  | { status: "no-faculty" }
  | { status: "no-semester" }
  | { status: "no-version"; context: EvaluationContext }
  | {
      status: "already-submitted";
      context: EvaluationContext;
      submittedAt?: string;
    }
  | { status: "ready"; data: ReadyData };

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Orchestrates the full evaluation data pipeline:
 *
 * 1. Resolve enrollment (store-first, API-fallback)
 * 2. Fetch active FACULTY_FEEDBACK version
 * 3. Check if already submitted
 * 4. Fetch existing draft (if not submitted)
 * 5. Build preview model + default form values
 *
 * Returns a discriminated union so the page only handles rendering.
 */
export function useEvaluationData(courseId: string): EvaluationDataResult {
  // --- Step 1: Resolve enrollment context ---
  const selectedCourse = useSelectedCourseStore((s) => s.selectedCourse);
  const hasStoreMatch = selectedCourse?.course.id === courseId;

  const enrollmentsQuery = useMyEnrollments({ page: 1, limit: 100 }, { enabled: !hasStoreMatch });

  const enrollment = hasStoreMatch
    ? selectedCourse
    : enrollmentsQuery.data?.data.find((e) => e.course.id === courseId);

  const enrollmentLoading = !hasStoreMatch && enrollmentsQuery.isLoading;
  const enrollmentError = !hasStoreMatch && enrollmentsQuery.isError;

  const faculty = enrollment?.faculty;
  const semester = enrollment?.semester;

  // --- Step 2: Fetch active version ---
  const activeVersionQuery = useActiveQuestionnaireVersion("FACULTY_FEEDBACK", {
    enabled: Boolean(enrollment) && Boolean(faculty) && Boolean(semester),
  });
  const activeVersion = activeVersionQuery.data;

  const evaluationParams = useMemo(
    () =>
      activeVersion && faculty && semester
        ? {
            versionId: activeVersion.id,
            facultyId: faculty.id,
            semesterId: semester.id,
            courseId,
          }
        : null,
    [activeVersion, faculty, semester, courseId]
  );

  // --- Step 3: Check if already submitted ---
  const submissionCheck = useCheckSubmission(evaluationParams);

  // --- Step 4: Fetch existing draft ---
  const draftQuery = useEvaluationDraft(evaluationParams, {
    enabled:
      Boolean(evaluationParams) && submissionCheck.isSuccess && !submissionCheck.data?.submitted,
  });

  // --- Step 5: Build model + handle stale draft ---
  const model = useMemo(
    () =>
      activeVersion
        ? buildQuestionnairePreviewModel({
            ...deserializeQuestionnaireVersionToDraft(activeVersion),
            hydratedFromServer: true,
          })
        : null,
    [activeVersion]
  );

  const draft = draftQuery.data;
  const isDraftStale = draft && activeVersion && draft.versionId !== activeVersion.id;

  // Auto-delete stale draft (version mismatch) — runs once
  const staleDeletedRef = useRef(false);
  useEffect(() => {
    if (isDraftStale && !staleDeletedRef.current) {
      staleDeletedRef.current = true;
      void deleteDraft(draft.id);
    }
  }, [isDraftStale, draft]);

  const defaultValues =
    draft && !isDraftStale
      ? {
          answers: draft.answers,
          qualitativeComment: draft.qualitativeComment ?? "",
        }
      : undefined;

  // --- Derive display strings (safe to call unconditionally) ---
  const context = useMemo<EvaluationContext | null>(() => {
    if (!enrollment || !faculty || !semester) return null;
    return buildEvaluationContext(enrollment, faculty, semester);
  }, [enrollment, faculty, semester]);

  // --- Status resolution (waterfall) ---

  if (enrollmentLoading) {
    return { status: "loading", message: "Loading course context..." };
  }

  if (enrollmentError || !enrollment) {
    return {
      status: "error",
      message: "This course is not in your current enrollments.",
    };
  }

  if (!faculty) return { status: "no-faculty" };
  if (!semester) return { status: "no-semester" };

  if (activeVersionQuery.isLoading) {
    return {
      status: "loading",
      message: "Loading questionnaire...",
      context: context ?? undefined,
    };
  }

  if (!activeVersion || !model || !context) {
    return {
      status: "no-version",
      context: buildEvaluationContext(enrollment, faculty, semester),
    };
  }

  if (submissionCheck.data?.submitted) {
    return {
      status: "already-submitted",
      context,
      submittedAt: submissionCheck.data.submittedAt,
    };
  }

  if (submissionCheck.isLoading || draftQuery.isLoading) {
    return {
      status: "loading",
      message: "Preparing your evaluation...",
      context,
    };
  }

  return {
    status: "ready",
    data: { ...context, activeVersion, model, defaultValues },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildEvaluationContext(
  enrollment: EnrollmentResponseDto,
  faculty: FacultyShortResponseDto,
  semester: SemesterShortResponseDto
): EvaluationContext {
  return {
    faculty,
    semester,
    courseName: decodeHtmlEntities(enrollment.course.fullname || "Course"),
    courseShortname: decodeHtmlEntities(enrollment.course.shortname || ""),
    facultyName: decodeHtmlEntities(faculty.fullName || ""),
    enrollmentSectionName: enrollment.section?.name
      ? decodeHtmlEntities(enrollment.section.name)
      : undefined,
  };
}
