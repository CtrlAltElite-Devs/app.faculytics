"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { useMe } from "@/features/auth/hooks/use-me";
import {
  ALL_PROGRAMS_LABEL,
  ALL_PROGRAMS_VALUE,
} from "@/features/faculty-analytics/constants/filters";
import { useFacultyList } from "@/features/faculty-analytics/hooks/use-faculty-list";
import {
  mapProgramOptionsToViewModel,
  mapSemesterOptionsToViewModel,
} from "@/features/faculty-analytics/lib/scoped-analytics-view-model";
import { useProgramOptions } from "@/features/faculty-analytics/hooks/use-program-options";
import { useSemesterOptions } from "@/features/faculty-analytics/hooks/use-semester-options";

type UseScopedFacultyAnalyticsListViewModelOptions = {
  allowAllPrograms?: boolean;
};

export function useScopedFacultyAnalyticsListViewModel(
  options?: UseScopedFacultyAnalyticsListViewModelOptions
) {
  const [selectedSemesterIdState, setSelectedSemesterId] = useState<string | null>(null);
  const [selectedProgramIdState, setSelectedProgramId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(DEFAULT_PAGE_SIZE);
  const allowAllPrograms = options?.allowAllPrograms ?? true;

  const deferredSearchValue = useDeferredValue(searchValue.trim());
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
    () => mapProgramOptionsToViewModel(programOptionsQuery.data?.data ?? [], allowAllPrograms),
    [allowAllPrograms, programOptionsQuery.data]
  );
  const selectedProgram =
    programs.find((program) => program.id === selectedProgramIdState) ?? programs[0] ?? null;
  const selectedProgramId = selectedProgram?.id ?? null;

  const facultyListQuery = useFacultyList(
    {
      semesterId: selectedSemesterId ?? "",
      programId: selectedProgramId ?? undefined,
      search: deferredSearchValue || undefined,
      page: currentPage,
      limit: rowsPerPage,
    },
    { enabled: Boolean(selectedSemesterId) && (allowAllPrograms || Boolean(selectedProgramId)) }
  );

  const selectedSemester =
    semesters.find((semester) => semester.id === selectedSemesterId) ?? semesters[0] ?? null;

  return {
    semesters,
    programs,
    selectedSemesterId,
    selectedSemesterLabel: selectedSemester?.label ?? "Select semester",
    selectedProgramId,
    selectedProgramLabel:
      selectedProgram?.label ?? (allowAllPrograms ? ALL_PROGRAMS_LABEL : "Select program"),
    facultyList: facultyListQuery.data?.data ?? [],
    pagination: facultyListQuery.data?.meta ?? {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: rowsPerPage,
      totalPages: 0,
      currentPage,
    },
    searchValue,
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
    isFetching:
      meQuery.isFetching ||
      semestersQuery.isFetching ||
      programOptionsQuery.isFetching ||
      facultyListQuery.isFetching,
    retry: () => {
      void meQuery.refetch();
      void semestersQuery.refetch();
      if (selectedSemesterId) {
        void programOptionsQuery.refetch();
      }
      if (selectedSemesterId) {
        void facultyListQuery.refetch();
      }
    },
    setSelectedSemesterId: (value: string) => {
      setSelectedSemesterId(value);
      setSelectedProgramId(null);
      setCurrentPage(1);
    },
    setSelectedProgramId: (value: string) => {
      setSelectedProgramId(value === ALL_PROGRAMS_VALUE && allowAllPrograms ? null : value);
      setCurrentPage(1);
    },
    setSearchValue: (value: string) => {
      setSearchValue(value);
      setCurrentPage(1);
    },
    setCurrentPage,
    setRowsPerPage: (value: number) => {
      setRowsPerPage(value);
      setCurrentPage(1);
    },
  };
}
