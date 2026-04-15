"use client";

import { useCallback, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  buildFacultyReportHref,
  formatFacultyReportCourseLabel,
  resolveFacultyReportQuestionnaireTypeCode,
  resolveFacultyReportQuestionnaireTypeLabel,
  resolvePositiveIntegerParam,
} from "@/features/faculty-analytics/lib/faculty-report-detail";
import { useFacultyEnrollments } from "@/features/faculty-analytics/hooks/use-faculty-enrollments";
import { useFacultyReportComments } from "@/features/faculty-analytics/hooks/use-faculty-report-comments";
import { useFacultyReport } from "@/features/faculty-analytics/hooks/use-faculty-report";
import { useQualitativeSummary } from "@/features/faculty-analytics/hooks/use-qualitative-summary";
import type { FacultyReportCourseOption, SentimentLabel } from "@/features/faculty-analytics/types";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import { resolvePageSizeOption } from "@/lib/pagination";
import { useActiveRole } from "@/features/auth/hooks/use-active-role";
import { getRoleConfig } from "@/features/auth/lib/role-route";

const VALID_SENTIMENTS: ReadonlySet<SentimentLabel> = new Set<SentimentLabel>([
  "positive",
  "neutral",
  "negative",
]);

function isSentimentLabel(value: string | null): value is SentimentLabel {
  return Boolean(value) && VALID_SENTIMENTS.has(value as SentimentLabel);
}

type UseFacultyReportDetailViewModelParams = {
  facultyId: string;
};

export function useFacultyReportDetailViewModel({
  facultyId,
}: UseFacultyReportDetailViewModelParams) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const currentSearchParams = useMemo(
    () => new URLSearchParams(searchParamsString),
    [searchParamsString]
  );

  const facultyNameParam = searchParams.get("facultyName") ?? "";
  const semesterId = searchParams.get("semesterId") ?? "";
  const semesterLabelParam = searchParams.get("semesterLabel") ?? "Selected semester";
  const courseId = searchParams.get("courseId") ?? "";
  const questionnaireTypeCode = resolveFacultyReportQuestionnaireTypeCode(
    searchParams.get("questionnaireTypeCode")
  );
  const commentsPage = resolvePositiveIntegerParam(searchParams.get("page"), 1);
  const commentsLimit = resolvePageSizeOption(searchParams.get("limit"), [5, 10, 20]);
  const rawSentiment = searchParams.get("sentiment");
  const sentimentFilter: SentimentLabel | null = isSentimentLabel(rawSentiment)
    ? rawSentiment
    : null;
  const themeLabelFilter = searchParams.get("themeLabel");

  const questionnaireTypesQuery = useQuestionnaireTypes();
  const questionnaireTypes = useMemo(
    () => questionnaireTypesQuery.data ?? [],
    [questionnaireTypesQuery.data]
  );
  const selectedQuestionnaireType =
    questionnaireTypes.find((type) => type.code === questionnaireTypeCode) ?? null;
  const availableQuestionnaireTypes = questionnaireTypes.map((type) => ({
    code: type.code,
    label: resolveFacultyReportQuestionnaireTypeLabel(type.code, type.name),
  }));
  const facultyEnrollmentsQuery = useFacultyEnrollments(
    {
      facultyId,
      semesterId,
      page: 1,
      limit: 100,
    },
    { enabled: Boolean(semesterId) }
  );
  const availableCourses = useMemo<FacultyReportCourseOption[]>(() => {
    const uniqueCourses = new Map<string, FacultyReportCourseOption>();

    for (const enrollment of facultyEnrollmentsQuery.data?.data ?? []) {
      const course = enrollment.course;
      if (!uniqueCourses.has(course.id)) {
        uniqueCourses.set(course.id, {
          id: course.id,
          label: formatFacultyReportCourseLabel(course.shortname, course.fullname),
        });
      }
    }

    return [...uniqueCourses.values()].sort((left, right) => left.label.localeCompare(right.label));
  }, [facultyEnrollmentsQuery.data?.data]);

  const reportQuery = useFacultyReport(
    {
      facultyId,
      semesterId,
      questionnaireTypeCode,
      courseId: courseId || undefined,
    },
    { enabled: Boolean(semesterId) }
  );
  const selectedCourse =
    availableCourses.find((course) => course.id === courseId) ??
    (courseId && reportQuery.data?.courseFilter
      ? {
          id: reportQuery.data.courseFilter.id,
          label: formatFacultyReportCourseLabel(
            reportQuery.data.courseFilter.code,
            reportQuery.data.courseFilter.title
          ),
        }
      : null);
  const qualitativeSummaryQuery = useQualitativeSummary(
    {
      facultyId,
      semesterId,
      questionnaireTypeCode,
      courseId: courseId || undefined,
    },
    { enabled: Boolean(semesterId && questionnaireTypeCode) }
  );

  const labelToId = useMemo(() => {
    const map = new Map<string, string>();
    for (const theme of qualitativeSummaryQuery.data?.themes ?? []) {
      map.set(theme.label, theme.themeId);
    }
    return map;
  }, [qualitativeSummaryQuery.data]);

  const resolvedThemeId = themeLabelFilter ? (labelToId.get(themeLabelFilter) ?? null) : null;

  const commentsQuery = useFacultyReportComments(
    {
      facultyId,
      semesterId,
      questionnaireTypeCode,
      courseId: courseId || undefined,
      page: commentsPage,
      limit: commentsLimit,
      sentiment: sentimentFilter ?? undefined,
      themeId: resolvedThemeId ?? undefined,
    },
    { enabled: Boolean(semesterId) }
  );

  useEffect(() => {
    if (questionnaireTypes.length === 0) {
      return;
    }

    const hasSelectedType = questionnaireTypes.some((type) => type.code === questionnaireTypeCode);
    if (hasSelectedType) {
      return;
    }

    const fallbackType = questionnaireTypes[0];
    const nextHref = buildFacultyReportHref(pathname, currentSearchParams, {
      questionnaireTypeCode: fallbackType?.code ?? null,
      page: "1",
    });

    router.replace(nextHref, { scroll: false });
  }, [currentSearchParams, pathname, questionnaireTypeCode, questionnaireTypes, router]);

  useEffect(() => {
    if (!courseId || !facultyEnrollmentsQuery.isSuccess) {
      return;
    }

    const hasSelectedCourse = availableCourses.some((course) => course.id === courseId);
    if (hasSelectedCourse) {
      return;
    }

    const nextHref = buildFacultyReportHref(pathname, currentSearchParams, {
      courseId: null,
      page: "1",
    });

    router.replace(nextHref, { scroll: false });
  }, [
    availableCourses,
    courseId,
    currentSearchParams,
    facultyEnrollmentsQuery.isSuccess,
    pathname,
    router,
  ]);

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const nextHref = buildFacultyReportHref(pathname, currentSearchParams, updates);
      router.replace(nextHref, { scroll: false });
    },
    [currentSearchParams, pathname, router]
  );

  const updateSentimentFilter = useCallback(
    (next: SentimentLabel | null) => {
      updateSearchParams({ sentiment: next, page: null });
    },
    [updateSearchParams]
  );

  const updateThemeFilter = useCallback(
    (next: string | null) => {
      updateSearchParams({ themeLabel: next, page: null });
    },
    [updateSearchParams]
  );

  const clearAllFilters = useCallback(() => {
    updateSearchParams({ sentiment: null, themeLabel: null, page: null });
  }, [updateSearchParams]);

  // F4: Silently strip unknown sentiment values from the URL before any API call.
  useEffect(() => {
    if (rawSentiment && !isSentimentLabel(rawSentiment)) {
      updateSentimentFilter(null);
    }
  }, [rawSentiment, updateSentimentFilter]);

  // Theme-label decay: clear when no match exists in the latest pipeline's themes.
  useEffect(() => {
    if (!themeLabelFilter || !qualitativeSummaryQuery.isSuccess) {
      return;
    }
    if (!labelToId.has(themeLabelFilter)) {
      updateThemeFilter(null);
      toast.info("Theme not found in current analysis");
    }
  }, [themeLabelFilter, qualitativeSummaryQuery.isSuccess, labelToId, updateThemeFilter]);

  const report = reportQuery.data ?? null;
  const reportTitle = report?.faculty.name || facultyNameParam || "Faculty report";
  const semesterLabel =
    report?.semester.label ||
    (semesterLabelParam.trim().length > 0 ? semesterLabelParam : "Selected semester");
  const questionnaireTypeLabel = resolveFacultyReportQuestionnaireTypeLabel(
    report?.questionnaireType.code ?? questionnaireTypeCode,
    report?.questionnaireType.name ?? selectedQuestionnaireType?.name
  );
  const comments = commentsQuery.data?.items ?? [];
  const commentsMeta = commentsQuery.data?.meta ?? null;
  const commentsCount = commentsMeta?.totalItems ?? comments.length;

  const refreshAll = () => {
    void facultyEnrollmentsQuery.refetch();
    void questionnaireTypesQuery.refetch();
    void reportQuery.refetch();
    void commentsQuery.refetch();
    void qualitativeSummaryQuery.refetch();
  };

  const { activeRole } = useActiveRole();
  const routePrefix = activeRole ? getRoleConfig(activeRole).routePrefix : "/dean";
  const backHref = `${routePrefix}/faculties`;

  return {
    backHref,
    facultyId,
    semesterId,
    courseId,
    selectedCourseLabel: selectedCourse?.label ?? "All courses",
    availableCourses,
    report,
    reportTitle,
    semesterLabel,
    questionnaireTypeCode,
    questionnaireTypeLabel,
    availableQuestionnaireTypes,
    comments,
    commentsMeta,
    commentsPage,
    commentsLimit,
    commentsCount,
    reportQuery,
    commentsQuery,
    qualitativeSummaryQuery,
    questionnaireTypesQuery,
    facultyEnrollmentsQuery,
    sentimentFilter,
    themeLabelFilter,
    resolvedThemeId,
    updateSentimentFilter,
    updateThemeFilter,
    clearAllFilters,
    isQuestionnaireTypeLoading: questionnaireTypesQuery.isLoading,
    isCourseLoading: facultyEnrollmentsQuery.isLoading,
    hasSemesterContext: Boolean(semesterId),
    updateQuestionnaireType: (value: string) => {
      updateSearchParams({
        questionnaireTypeCode: value,
        page: "1",
      });
    },
    updateCourse: (value: string) => {
      updateSearchParams({
        courseId: value === "ALL" ? null : value,
        page: "1",
      });
    },
    updateCommentsPage: (page: number) => {
      updateSearchParams({
        page: String(page),
        limit: String(commentsLimit),
      });
    },
    updateCommentsLimit: (value: number) => {
      updateSearchParams({
        page: "1",
        limit: String(value),
      });
    },
    retryComments: () => {
      void commentsQuery.refetch();
    },
    retryAll: refreshAll,
    goBackToFaculties: () => {
      router.push(backHref);
    },
  };
}
