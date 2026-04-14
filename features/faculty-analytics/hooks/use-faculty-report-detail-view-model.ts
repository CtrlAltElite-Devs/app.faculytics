"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
import type { FacultyReportCourseOption } from "@/features/faculty-analytics/types";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import { resolvePageSizeOption } from "@/lib/pagination";
import { useActiveRole } from "@/features/auth/hooks/use-active-role";
import { getRoleConfig } from "@/features/auth/lib/role-route";

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
  const commentsQuery = useFacultyReportComments(
    {
      facultyId,
      semesterId,
      questionnaireTypeCode,
      courseId: courseId || undefined,
      page: commentsPage,
      limit: commentsLimit,
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

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const nextHref = buildFacultyReportHref(pathname, currentSearchParams, updates);
    router.replace(nextHref, { scroll: false });
  };

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
    questionnaireTypesQuery,
    facultyEnrollmentsQuery,
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
