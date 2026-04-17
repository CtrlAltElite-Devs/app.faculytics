"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useMe } from "@/features/auth/hooks/use-me";
import { useAttentionList } from "@/features/faculty-analytics/hooks/use-attention-list";
import {
  fetchDepartmentOptions,
  fetchSemesters,
} from "@/features/faculty-analytics/api/faculty-analytics.requests";
import {
  ALL_PROGRAMS_LABEL,
  ALL_PROGRAMS_VALUE,
} from "@/features/faculty-analytics/constants/filters";
import {
  mapDepartmentOptionsToViewModel,
  mapDepartmentOverviewToDashboardViewModel,
  mapProgramOptionsToViewModel,
  mapSemesterOptionsToViewModel,
} from "@/features/faculty-analytics/lib/scoped-analytics-view-model";
import { useDepartmentOverview } from "@/features/faculty-analytics/hooks/use-department-overview";
import { useProgramOptions } from "@/features/faculty-analytics/hooks/use-program-options";
import { useSemesterOptions } from "@/features/faculty-analytics/hooks/use-semester-options";
import { formatRelativeTime } from "@/lib/date";
import type { ScopeLabel } from "@/features/faculty-analytics/components/scoped-analytics-dashboard-screen";
import { useAuthStore } from "@/stores/auth-store";

export function useScopedAnalyticsDashboardViewModel(scopeLabel: ScopeLabel) {
  const [selectedSemesterIdState, setSelectedSemesterId] = useState<string | null>(null);
  const [selectedDepartmentIdState, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedProgramCodeState, setSelectedProgramCode] = useState<string | null>(null);
  const meQuery = useMe();
  const token = useAuthStore((state) => state.token);
  const profileSemestersQuery = useSemesterOptions(
    meQuery.data?.campus?.id ? { campusId: meQuery.data.campus.id } : undefined,
    { enabled: !meQuery.isLoading && !meQuery.isError && scopeLabel !== "Campus" }
  );
  const campusHeadSemestersQuery = useQuery({
    queryKey: ["semesters", "campus-head-accessible", token],
    enabled: Boolean(token) && scopeLabel === "Campus",
    queryFn: async () => {
      const allSemesters = await fetchSemesters();
      const accessibility = await Promise.all(
        allSemesters.data.map(async (semester) => {
          const departments = await fetchDepartmentOptions({
            semesterId: semester.id,
            limit: 1,
          });

          return {
            semester,
            isAccessible: departments.data.length > 0,
          };
        })
      );

      return accessibility.filter((item) => item.isAccessible).map((item) => item.semester);
    },
  });
  const scopedSemesterOptionsSource = useMemo(
    () =>
      scopeLabel === "Campus"
        ? (campusHeadSemestersQuery.data ?? [])
        : (profileSemestersQuery.data?.data ?? []),
    [campusHeadSemestersQuery.data, profileSemestersQuery.data?.data, scopeLabel]
  );

  const semesters = useMemo(
    () => mapSemesterOptionsToViewModel(scopedSemesterOptionsSource),
    [scopedSemesterOptionsSource]
  );
  const selectedSemesterId =
    selectedSemesterIdState && semesters.some((semester) => semester.id === selectedSemesterIdState)
      ? selectedSemesterIdState
      : (semesters[0]?.id ?? null);

  const departmentOptionsQuery = useQuery({
    queryKey: ["curriculum", "department-options", selectedSemesterId, token],
    enabled: Boolean(token) && Boolean(selectedSemesterId) && scopeLabel === "Campus",
    queryFn: () =>
      fetchDepartmentOptions({
        semesterId: selectedSemesterId ?? "",
        limit: 100,
      }),
  });
  const departments = useMemo(
    () =>
      scopeLabel === "Campus"
        ? mapDepartmentOptionsToViewModel(departmentOptionsQuery.data?.data ?? [])
        : [],
    [departmentOptionsQuery.data, scopeLabel]
  );
  const selectedDepartment =
    departments.find((department) => department.id === (selectedDepartmentIdState ?? "")) ??
    departments[0] ??
    null;
  const selectedDepartmentId = selectedDepartment?.id || null;
  const selectedDepartmentCode = selectedDepartment?.code || null;

  const programOptionsQuery = useProgramOptions(
    {
      semesterId: selectedSemesterId ?? "",
      departmentId: scopeLabel === "Campus" ? (selectedDepartmentId ?? undefined) : undefined,
      limit: 100,
    },
    { enabled: Boolean(selectedSemesterId) }
  );
  const programs = useMemo(
    () => mapProgramOptionsToViewModel(programOptionsQuery.data?.data ?? []),
    [programOptionsQuery.data]
  );
  const selectedProgram =
    programs.find((program) => program.code === selectedProgramCodeState) ?? programs[0] ?? null;
  const selectedProgramCode = selectedProgram?.code ?? null;

  const overviewQuery = useDepartmentOverview(
    { semesterId: selectedSemesterId ?? "", programCode: selectedProgramCode ?? undefined },
    { enabled: Boolean(selectedSemesterId) }
  );
  const attentionQuery = useAttentionList(
    { semesterId: selectedSemesterId ?? "", programCode: selectedProgramCode ?? undefined },
    { enabled: Boolean(selectedSemesterId) }
  );

  const filteredOverview = useMemo(() => {
    if (!overviewQuery.data) {
      return null;
    }

    if (scopeLabel !== "Campus" || !selectedDepartmentCode) {
      return overviewQuery.data;
    }

    const faculty = overviewQuery.data.faculty.filter(
      (item) => item.departmentCode === selectedDepartmentCode
    );

    return {
      ...overviewQuery.data,
      faculty,
      summary: faculty.reduce(
        (summary, item) => ({
          totalFaculty: summary.totalFaculty + 1,
          totalSubmissions: summary.totalSubmissions + item.submissionCount,
          totalAnalyzed: summary.totalAnalyzed + item.analyzedCount,
          positiveCount: summary.positiveCount + item.positiveCount,
          negativeCount: summary.negativeCount + item.negativeCount,
          neutralCount: summary.neutralCount + item.neutralCount,
        }),
        {
          totalFaculty: 0,
          totalSubmissions: 0,
          totalAnalyzed: 0,
          positiveCount: 0,
          negativeCount: 0,
          neutralCount: 0,
        }
      ),
    };
  }, [overviewQuery.data, scopeLabel, selectedDepartmentCode]);

  const filteredAttentionItems = useMemo(() => {
    if (scopeLabel !== "Campus" || !selectedDepartmentCode) {
      return attentionQuery.data?.items ?? [];
    }

    return (attentionQuery.data?.items ?? []).filter(
      (item) => item.departmentCode === selectedDepartmentCode
    );
  }, [attentionQuery.data?.items, scopeLabel, selectedDepartmentCode]);

  const selectedSemester =
    semesters.find((semester) => semester.id === selectedSemesterId) ?? semesters[0] ?? null;

  const dashboardViewModel = filteredOverview
    ? mapDepartmentOverviewToDashboardViewModel({
        overview: filteredOverview,
        semesters,
        selectedSemesterId,
        lastUpdatedLabel: filteredOverview.lastRefreshedAt
          ? formatRelativeTime(filteredOverview.lastRefreshedAt)
          : "Not yet available",
      })
    : null;

  const isLoading =
    meQuery.isLoading ||
    (scopeLabel === "Campus"
      ? campusHeadSemestersQuery.isLoading
      : profileSemestersQuery.isLoading) ||
    (Boolean(selectedSemesterId) && scopeLabel === "Campus" && departmentOptionsQuery.isLoading) ||
    (Boolean(selectedSemesterId) && programOptionsQuery.isLoading) ||
    (Boolean(selectedSemesterId) && overviewQuery.isLoading);
  const isError =
    meQuery.isError ||
    (scopeLabel === "Campus" ? campusHeadSemestersQuery.isError : profileSemestersQuery.isError) ||
    departmentOptionsQuery.isError ||
    programOptionsQuery.isError ||
    overviewQuery.isError;
  return {
    departments,
    selectedDepartmentId,
    selectedDepartmentLabel: selectedDepartment?.label ?? "All Departments",
    semesters,
    programs,
    selectedSemesterId,
    selectedSemesterLabel: selectedSemester?.label ?? "Select semester",
    selectedProgramCode,
    selectedProgramLabel: selectedProgram?.label ?? ALL_PROGRAMS_LABEL,
    lastUpdatedLabel: dashboardViewModel?.lastUpdatedLabel ?? "Not yet available",
    summary: dashboardViewModel?.summary ?? {
      totalFaculty: 0,
      totalSubmissions: 0,
      totalAnalyzed: 0,
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0,
      positiveSentimentRate: 0,
    },
    overallSentiment: dashboardViewModel?.overallSentiment ?? [],
    attentionItems: filteredAttentionItems,
    overview: filteredOverview ?? null,
    isAttentionLoading: Boolean(selectedSemesterId) && attentionQuery.isLoading,
    isLoading,
    isError,
    retry: () => {
      void meQuery.refetch();
      if (scopeLabel === "Campus") {
        void campusHeadSemestersQuery.refetch();
        if (selectedSemesterId) {
          void departmentOptionsQuery.refetch();
        }
      } else {
        void profileSemestersQuery.refetch();
      }
      if (selectedSemesterId) {
        void programOptionsQuery.refetch();
      }
      if (selectedSemesterId) {
        void overviewQuery.refetch();
        void attentionQuery.refetch();
      }
    },
    setSelectedSemesterId: (value: string) => {
      setSelectedSemesterId(value);
      setSelectedDepartmentId(null);
      setSelectedProgramCode(null);
    },
    setSelectedDepartmentId: (value: string) => {
      setSelectedDepartmentId(value || null);
      setSelectedProgramCode(null);
    },
    setSelectedProgramCode: (value: string) => {
      setSelectedProgramCode(value === ALL_PROGRAMS_VALUE ? null : value);
    },
  };
}
