"use client";

import { useMemo } from "react";

import { useMe } from "@/features/auth/hooks/use-me";
import {
  mapProgramOptionsToViewModel,
  mapSemesterOptionsToViewModel,
} from "@/features/faculty-analytics/lib/scoped-analytics-view-model";
import { useProgramOptions } from "@/features/faculty-analytics/hooks/use-program-options";
import { useSemesterOptions } from "@/features/faculty-analytics/hooks/use-semester-options";
import { useScopedFacultyList } from "@/features/faculty-evaluation/hooks/use-scoped-faculty-list";
import type { FacultyEvaluationListItem } from "@/features/faculty-evaluation/types";

const DEFAULT_LIMIT = 100;

function mapRows(
  facultyRows: readonly {
    id: string;
    fullName: string;
    profilePicture: string | null;
    subjects: string[];
  }[]
): FacultyEvaluationListItem[] {
  return facultyRows.map((faculty) => ({
    id: faculty.id,
    fullName: faculty.fullName,
    profilePicture: faculty.profilePicture,
    subjects: faculty.subjects,
  }));
}

type UseFacultyEvaluationListDataOptions = {
  selectedSemesterIdParam: string | null;
  selectedProgramIdParam: string | null;
  deferredSearchValue: string;
};

export function useFacultyEvaluationListData({
  selectedSemesterIdParam,
  selectedProgramIdParam,
  deferredSearchValue,
}: UseFacultyEvaluationListDataOptions) {
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
    selectedSemesterIdParam && semesters.some((semester) => semester.id === selectedSemesterIdParam)
      ? selectedSemesterIdParam
      : (semesters[0]?.id ?? null);

  const selectedSemester =
    semesters.find((semester) => semester.id === selectedSemesterId) ?? semesters[0] ?? null;

  const programOptionsQuery = useProgramOptions(
    { semesterId: selectedSemesterId ?? "", limit: DEFAULT_LIMIT },
    { enabled: Boolean(selectedSemesterId) }
  );

  const programs = useMemo(
    () => mapProgramOptionsToViewModel(programOptionsQuery.data?.data ?? []),
    [programOptionsQuery.data]
  );

  const selectedProgram =
    programs.find((program) => program.id === selectedProgramIdParam) ?? programs[0] ?? null;
  const selectedProgramId = selectedProgram?.id ?? null;

  const facultyListQuery = useScopedFacultyList(
    {
      semesterId: selectedSemesterId ?? "",
      programId: selectedProgramId ?? undefined,
      search: deferredSearchValue || undefined,
      page: 1,
      limit: DEFAULT_LIMIT,
    },
    { enabled: Boolean(selectedSemesterId) }
  );

  return {
    semesters,
    programs,
    selectedSemesterId,
    selectedSemesterLabel: selectedSemester?.label ?? "Select semester",
    selectedProgramId,
    selectedProgramLabel: selectedProgram?.label ?? "All Programs",
    facultyRows: mapRows(facultyListQuery.data?.data ?? []),
    totalItems: facultyListQuery.data?.meta.totalItems ?? 0,
    isLoading:
      meQuery.isLoading ||
      semestersQuery.isLoading ||
      (Boolean(selectedSemesterId) && programOptionsQuery.isLoading) ||
      (Boolean(selectedSemesterId) && facultyListQuery.isLoading),
    isError:
      meQuery.isError ||
      semestersQuery.isError ||
      programOptionsQuery.isError ||
      facultyListQuery.isError,
    retry: () => {
      void meQuery.refetch();
      void semestersQuery.refetch();
      if (selectedSemesterId) {
        void programOptionsQuery.refetch();
        void facultyListQuery.refetch();
      }
    },
  };
}
