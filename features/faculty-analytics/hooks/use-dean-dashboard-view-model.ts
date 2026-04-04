"use client";

import { useMemo, useState } from "react";

import { useMe } from "@/features/auth/hooks/use-me";
import { useAttentionList } from "@/features/faculty-analytics/hooks/use-attention-list";
import {
  ALL_PROGRAMS_LABEL,
  ALL_PROGRAMS_VALUE,
} from "@/features/faculty-analytics/constants/filters";
import {
  mapDepartmentOverviewToDashboardViewModel,
  mapProgramOptionsToViewModel,
  mapSemesterOptionsToViewModel,
} from "@/features/faculty-analytics/lib/dean-analytics-view-model";
import { useDepartmentOverview } from "@/features/faculty-analytics/hooks/use-department-overview";
import { useProgramOptions } from "@/features/faculty-analytics/hooks/use-program-options";
import { useSemesterOptions } from "@/features/faculty-analytics/hooks/use-semester-options";
import { formatRelativeTime } from "@/lib/date";

export function useDeanDashboardViewModel() {
  const [selectedSemesterIdState, setSelectedSemesterId] = useState<string | null>(null);
  const [selectedProgramCodeState, setSelectedProgramCode] = useState<string | null>(null);
  const meQuery = useMe();
  const campusId = meQuery.data?.campus?.id;
  const semestersQuery = useSemesterOptions(campusId ? { campusId } : undefined, {
    enabled: !meQuery.isLoading && !meQuery.isError,
  });
  const semesters = useMemo(
    () => mapSemesterOptionsToViewModel(semestersQuery.data?.data ?? []),
    [semestersQuery.data]
  );
  const selectedSemesterId =
    selectedSemesterIdState && semesters.some((semester) => semester.id === selectedSemesterIdState)
      ? selectedSemesterIdState
      : (semesters[0]?.id ?? null);

  const programOptionsQuery = useProgramOptions(
    { semesterId: selectedSemesterId ?? "", limit: 100 },
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

  const selectedSemester =
    semesters.find((semester) => semester.id === selectedSemesterId) ?? semesters[0] ?? null;

  const dashboardViewModel = overviewQuery.data
    ? mapDepartmentOverviewToDashboardViewModel({
        overview: overviewQuery.data,
        semesters,
        selectedSemesterId,
        lastUpdatedLabel: overviewQuery.data.lastRefreshedAt
          ? formatRelativeTime(overviewQuery.data.lastRefreshedAt)
          : "Not yet available",
      })
    : null;

  const isLoading =
    meQuery.isLoading ||
    semestersQuery.isLoading ||
    (Boolean(selectedSemesterId) && programOptionsQuery.isLoading) ||
    (Boolean(selectedSemesterId) && overviewQuery.isLoading);
  const isError =
    meQuery.isError ||
    semestersQuery.isError ||
    programOptionsQuery.isError ||
    overviewQuery.isError;
  const isRefreshing =
    meQuery.isFetching ||
    semestersQuery.isFetching ||
    programOptionsQuery.isFetching ||
    overviewQuery.isFetching ||
    attentionQuery.isFetching;

  return {
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
    attentionItems: attentionQuery.data?.items ?? [],
    overview: overviewQuery.data ?? null,
    isAttentionLoading: Boolean(selectedSemesterId) && attentionQuery.isLoading,
    isLoading,
    isRefreshing,
    isError,
    retry: () => {
      void meQuery.refetch();
      void semestersQuery.refetch();
      if (selectedSemesterId) {
        void programOptionsQuery.refetch();
      }
      if (selectedSemesterId) {
        void overviewQuery.refetch();
        void attentionQuery.refetch();
      }
    },
    refresh: () => {
      void meQuery.refetch();
      void semestersQuery.refetch();
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
      setSelectedProgramCode(null);
    },
    setSelectedProgramCode: (value: string) => {
      setSelectedProgramCode(value === ALL_PROGRAMS_VALUE ? null : value);
    },
  };
}
