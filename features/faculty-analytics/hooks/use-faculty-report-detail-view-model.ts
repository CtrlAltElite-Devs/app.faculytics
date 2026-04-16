"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  buildFacultyReportHref,
  formatFacultyReportCourseLabel,
  isInvalidViewParam,
  resolveFacultyReportQuestionnaireTypeCode,
  resolveFacultyReportQuestionnaireTypeLabel,
  resolvePositiveIntegerParam,
  resolveView,
} from "@/features/faculty-analytics/lib/faculty-report-detail";
import { useFacultyEnrollments } from "@/features/faculty-analytics/hooks/use-faculty-enrollments";
import { useFacultyReportComments } from "@/features/faculty-analytics/hooks/use-faculty-report-comments";
import { useFacultyReport } from "@/features/faculty-analytics/hooks/use-faculty-report";
import { useFacultyQuestionnaireTypes } from "@/features/faculty-analytics/hooks/use-faculty-questionnaire-types";
import { useQualitativeSummary } from "@/features/faculty-analytics/hooks/use-qualitative-summary";
import {
  DEFAULT_REPORT_VIEW,
  type FacultyQuestionnaireTypeOptionDto,
  type FacultyReportCourseOption,
  type ReportView,
  type SentimentLabel,
} from "@/features/faculty-analytics/types";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import { resolvePageSizeOption } from "@/lib/pagination";
import { useActiveRole } from "@/features/auth/hooks/use-active-role";
import { getRoleConfig } from "@/features/auth/lib/role-route";
import { APP_ROLES } from "@/constants/roles";

const VALID_SENTIMENTS: ReadonlySet<SentimentLabel> = new Set<SentimentLabel>([
  "positive",
  "neutral",
  "negative",
]);

function isSentimentLabel(value: string | null): value is SentimentLabel {
  return Boolean(value) && VALID_SENTIMENTS.has(value as SentimentLabel);
}

export type ParamAutoCorrection = {
  requested: string;
  actual: string;
};

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
  const rawQuestionnaireTypeCode = searchParams.get("questionnaireTypeCode");
  const rawViewParam = searchParams.get("view");
  const selectedView: ReportView = resolveView(rawViewParam);
  const commentsPage = resolvePositiveIntegerParam(searchParams.get("page"), 1);
  const commentsLimit = resolvePageSizeOption(searchParams.get("limit"), [5, 10, 20]);
  const rawSentiment = searchParams.get("sentiment");
  const sentimentFilter: SentimentLabel | null = isSentimentLabel(rawSentiment)
    ? rawSentiment
    : null;
  const themeLabelFilter = searchParams.get("themeLabel");
  const rawFacetParam = searchParams.get("facet");

  const globalQuestionnaireTypesQuery = useQuestionnaireTypes();
  const globalQuestionnaireTypes = useMemo(
    () => globalQuestionnaireTypesQuery.data ?? [],
    [globalQuestionnaireTypesQuery.data]
  );

  // Per-faculty per-semester counts (Task 4 hook). Distinct from the global
  // registry above — this drives the questionnaire-type secondary tabs.
  const availableQuestionnaireTypesQuery = useFacultyQuestionnaireTypes(
    { facultyId, semesterId },
    { enabled: Boolean(semesterId) }
  );
  const availableQuestionnaireTypes = useMemo<FacultyQuestionnaireTypeOptionDto[]>(
    () => availableQuestionnaireTypesQuery.data?.items ?? [],
    [availableQuestionnaireTypesQuery.data]
  );

  // Derive the active questionnaire type from URL ⊕ default. `fromUrl` is
  // always a non-empty string (resolveFacultyReportQuestionnaireTypeCode
  // falls back to DEFAULT_QUESTIONNAIRE_TYPE when the URL param is missing).
  // We return `fromUrl` both while the available-types query is still loading
  // AND when the URL's code simply isn't in the faculty's list — the outer
  // `queriesReady` gate prevents premature fetches during loading, and
  // returning `fromUrl` instead of `null` guarantees `params.questionnaireTypeCode`
  // is NEVER the empty string at the hook site, which is the load-bearing
  // invariant that keeps downstream queries from shipping `questionnaireTypeCode=`
  // to the backend under any invalidation/refetch bypass of the `enabled` guard.
  const questionnaireTypeCode = useMemo<string>(() => {
    const fromUrl = resolveFacultyReportQuestionnaireTypeCode(rawQuestionnaireTypeCode);
    const stillValid = availableQuestionnaireTypes.some((option) => option.code === fromUrl);
    if (stillValid) return fromUrl;
    return availableQuestionnaireTypes[0]?.code ?? fromUrl;
  }, [rawQuestionnaireTypeCode, availableQuestionnaireTypes]);

  const isQuestionnaireTypesResolving =
    Boolean(semesterId) && availableQuestionnaireTypesQuery.isLoading;
  const queriesReady =
    Boolean(semesterId) && Boolean(questionnaireTypeCode) && !isQuestionnaireTypesResolving;

  const selectedQuestionnaireType =
    availableQuestionnaireTypes.find((type) => type.code === questionnaireTypeCode) ??
    globalQuestionnaireTypes.find((type) => type.code === questionnaireTypeCode) ??
    null;

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
    { enabled: queriesReady }
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
    },
    { enabled: queriesReady }
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
      page: commentsPage,
      limit: commentsLimit,
      sentiment: sentimentFilter ?? undefined,
      themeId: resolvedThemeId ?? undefined,
    },
    { enabled: queriesReady }
  );

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const nextHref = buildFacultyReportHref(pathname, currentSearchParams, updates);
      router.replace(nextHref, { scroll: false });
    },
    [currentSearchParams, pathname, router]
  );

  // Auto-correction notices (Decision §16) are derived from the raw URL
  // values + currently-available data — never written via setState inside an
  // effect (React 19 `react-hooks/set-state-in-effect` rule). Dismissals are
  // tracked per-requested-value so a different invalid value re-surfaces the
  // notice. URL cleanup happens at dismiss time, not at notice-display time.
  const [dismissedQuestionnaireTypeCode, setDismissedQuestionnaireTypeCode] = useState<
    string | null
  >(null);
  const [dismissedView, setDismissedView] = useState<string | null>(null);
  const [dismissedThemeLabel, setDismissedThemeLabel] = useState<string | null>(null);

  const questionnaireTypeCodeAutoCorrection: ParamAutoCorrection | null = useMemo(() => {
    if (!availableQuestionnaireTypesQuery.isSuccess) return null;
    if (!rawQuestionnaireTypeCode) return null;
    if (availableQuestionnaireTypes.length === 0) return null;
    if (dismissedQuestionnaireTypeCode === rawQuestionnaireTypeCode) return null;

    const isValid = availableQuestionnaireTypes.some(
      (option) => option.code === rawQuestionnaireTypeCode
    );
    if (isValid) return null;

    const fallbackCode = availableQuestionnaireTypes[0]?.code ?? null;
    return {
      requested: rawQuestionnaireTypeCode,
      actual: fallbackCode ?? "(none)",
    };
  }, [
    availableQuestionnaireTypes,
    availableQuestionnaireTypesQuery.isSuccess,
    rawQuestionnaireTypeCode,
    dismissedQuestionnaireTypeCode,
  ]);

  const viewAutoCorrection: ParamAutoCorrection | null = useMemo(() => {
    if (!isInvalidViewParam(rawViewParam)) return null;
    if (dismissedView === rawViewParam) return null;
    return {
      requested: rawViewParam ?? "",
      actual: DEFAULT_REPORT_VIEW,
    };
  }, [rawViewParam, dismissedView]);

  // Course-id decay (unchanged behaviour, no auto-correction notice).
  useEffect(() => {
    if (!courseId || !facultyEnrollmentsQuery.isSuccess) {
      return;
    }

    const hasSelectedCourse = availableCourses.some((course) => course.id === courseId);
    if (hasSelectedCourse) {
      return;
    }

    updateSearchParams({ courseId: null, page: null });
  }, [availableCourses, courseId, facultyEnrollmentsQuery.isSuccess, updateSearchParams]);

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

  const selectView = useCallback(
    (next: ReportView) => {
      updateSearchParams({ view: next === DEFAULT_REPORT_VIEW ? null : next });
    },
    [updateSearchParams]
  );

  const selectQuestionnaireType = useCallback(
    (code: string | null) => {
      updateSearchParams({ questionnaireTypeCode: code, page: null });
    },
    [updateSearchParams]
  );

  const clearAllFilters = useCallback(() => {
    updateSearchParams({ sentiment: null, themeLabel: null, page: null });
  }, [updateSearchParams]);

  const dismissQuestionnaireTypeCodeAutoCorrection = useCallback(() => {
    if (rawQuestionnaireTypeCode) {
      setDismissedQuestionnaireTypeCode(rawQuestionnaireTypeCode);
      // Strip the bad param so deep links self-clean on dismiss.
      updateSearchParams({ questionnaireTypeCode: null, page: null });
    }
  }, [rawQuestionnaireTypeCode, updateSearchParams]);
  const dismissThemeLabelAutoCorrection = useCallback(() => {
    setDismissedThemeLabel(themeLabelFilter ?? null);
    if (themeLabelFilter) {
      updateSearchParams({ themeLabel: null, page: null });
    }
  }, [themeLabelFilter, updateSearchParams]);
  const dismissViewAutoCorrection = useCallback(() => {
    if (rawViewParam) {
      setDismissedView(rawViewParam);
      updateSearchParams({ view: null });
    }
  }, [rawViewParam, updateSearchParams]);

  // F4: Silently strip unknown sentiment values from the URL before any API call.
  useEffect(() => {
    if (rawSentiment && !isSentimentLabel(rawSentiment)) {
      updateSentimentFilter(null);
    }
  }, [rawSentiment, updateSentimentFilter]);

  // Active strip for the deprecated ?facet= URL param. Old bookmarked deep
  // links self-clean on first load. Matches the primitive-dep pattern of
  // the sentiment-cleanup effect above so we don't double-fire on unrelated
  // URL changes.
  useEffect(() => {
    if (rawFacetParam !== null) {
      updateSearchParams({ facet: null });
    }
  }, [rawFacetParam, updateSearchParams]);

  // Theme-label decay surfaces as a derived auto-correction notice
  // (Decision §16, Task 7a). The orphaned label stays in the URL until the
  // user dismisses; this avoids set-state-in-effect and keeps the notice
  // visible for the lifetime of that param.
  const themeLabelAutoCorrection: ParamAutoCorrection | null = useMemo(() => {
    if (!themeLabelFilter) return null;
    if (!qualitativeSummaryQuery.isSuccess) return null;
    if (labelToId.has(themeLabelFilter)) return null;
    if (dismissedThemeLabel === themeLabelFilter) return null;
    return { requested: themeLabelFilter, actual: "(no filter)" };
  }, [themeLabelFilter, qualitativeSummaryQuery.isSuccess, labelToId, dismissedThemeLabel]);

  const report = reportQuery.data ?? null;
  const reportTitle = report?.faculty.name || facultyNameParam || "Faculty report";
  const semesterLabel =
    report?.semester.label ||
    (semesterLabelParam.trim().length > 0 ? semesterLabelParam : "Selected semester");
  const questionnaireTypeLabel = resolveFacultyReportQuestionnaireTypeLabel(
    report?.questionnaireType.code ?? questionnaireTypeCode ?? "",
    report?.questionnaireType.name ?? selectedQuestionnaireType?.name
  );
  const comments = commentsQuery.data?.items ?? [];
  const commentsMeta = commentsQuery.data?.meta ?? null;
  const commentsCount = commentsMeta?.totalItems ?? comments.length;

  const refreshAll = () => {
    void facultyEnrollmentsQuery.refetch();
    void globalQuestionnaireTypesQuery.refetch();
    void availableQuestionnaireTypesQuery.refetch();
    void reportQuery.refetch();
    void commentsQuery.refetch();
    void qualitativeSummaryQuery.refetch();
  };

  const { activeRole } = useActiveRole();
  const roleConfig = activeRole ? getRoleConfig(activeRole) : null;
  const isFacultySelf = activeRole === APP_ROLES.FACULTY;
  const backHref = isFacultySelf
    ? (roleConfig?.homePath ?? "/faculty/analytics")
    : `${roleConfig?.routePrefix ?? "/dean"}/faculties`;
  const backLabel = "Back to Faculties";

  return {
    backHref,
    backLabel,
    isFacultySelfView: isFacultySelf,
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
    selectedView,
    selectView,
    availableQuestionnaireTypes,
    selectQuestionnaireType,
    comments,
    commentsMeta,
    commentsPage,
    commentsLimit,
    commentsCount,
    reportQuery,
    commentsQuery,
    qualitativeSummaryQuery,
    questionnaireTypesQuery: globalQuestionnaireTypesQuery,
    availableQuestionnaireTypesQuery,
    facultyEnrollmentsQuery,
    sentimentFilter,
    themeLabelFilter,
    resolvedThemeId,
    updateSentimentFilter,
    updateThemeFilter,
    clearAllFilters,
    questionnaireTypeCodeAutoCorrection,
    themeLabelAutoCorrection,
    viewAutoCorrection,
    dismissQuestionnaireTypeCodeAutoCorrection,
    dismissThemeLabelAutoCorrection,
    dismissViewAutoCorrection,
    isQuestionnaireTypeLoading: isQuestionnaireTypesResolving,
    isCourseLoading: facultyEnrollmentsQuery.isLoading,
    hasSemesterContext: Boolean(semesterId),
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
