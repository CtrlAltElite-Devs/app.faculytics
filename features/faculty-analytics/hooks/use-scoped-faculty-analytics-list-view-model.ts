"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { useMe } from "@/features/auth/hooks/use-me";
import {
  ALL_PROGRAMS_LABEL,
  ALL_PROGRAMS_VALUE,
} from "@/features/faculty-analytics/constants/filters";
import {
  fetchDepartmentOptions,
  fetchSemesters,
} from "@/features/faculty-analytics/api/faculty-analytics.requests";
import { useFacultyList } from "@/features/faculty-analytics/hooks/use-faculty-list";
import { isHiddenFaculty } from "@/features/faculty-analytics/lib/hidden-faculty";
import {
  mapDepartmentOptionsToViewModel,
  mapProgramOptionsToViewModel,
  mapSemesterOptionsToViewModel,
} from "@/features/faculty-analytics/lib/scoped-analytics-view-model";
import { useProgramOptions } from "@/features/faculty-analytics/hooks/use-program-options";
import { useSemesterOptions } from "@/features/faculty-analytics/hooks/use-semester-options";
import type { ScopeLabel } from "@/features/faculty-analytics/components/scoped-dashboard-section-types";
import { useAuthStore } from "@/stores/auth-store";

type UseScopedFacultyAnalyticsListViewModelOptions = {
  scopeLabel: ScopeLabel;
  allowAllPrograms?: boolean;
};

export function useScopedFacultyAnalyticsListViewModel(
  options: UseScopedFacultyAnalyticsListViewModelOptions
) {
  const [selectedSemesterIdState, setSelectedSemesterId] = useState<string | null>(null);
  const [selectedDepartmentIdState, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedProgramIdState, setSelectedProgramId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(DEFAULT_PAGE_SIZE);
  const scopeLabel = options.scopeLabel;
  const allowAllPrograms = options.allowAllPrograms ?? true;
  const isCampusScope = scopeLabel === "Campus";

  const deferredSearchValue = useDeferredValue(searchValue.trim());
  const meQuery = useMe();
  const token = useAuthStore((state) => state.token);
  const profileSemestersQuery = useSemesterOptions(
    meQuery.data?.campus?.id ? { campusId: meQuery.data.campus.id } : undefined,
    { enabled: !meQuery.isLoading && !meQuery.isError && !isCampusScope }
  );
  const campusHeadSemestersQuery = useQuery({
    queryKey: ["semesters", "campus-head-accessible", token],
    enabled: Boolean(token) && isCampusScope,
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
      isCampusScope
        ? (campusHeadSemestersQuery.data ?? [])
        : (profileSemestersQuery.data?.data ?? []),
    [campusHeadSemestersQuery.data, isCampusScope, profileSemestersQuery.data?.data]
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
    enabled: Boolean(token) && Boolean(selectedSemesterId) && isCampusScope,
    queryFn: () =>
      fetchDepartmentOptions({
        semesterId: selectedSemesterId ?? "",
        limit: 100,
      }),
  });
  const departments = useMemo(
    () =>
      isCampusScope ? mapDepartmentOptionsToViewModel(departmentOptionsQuery.data?.data ?? []) : [],
    [departmentOptionsQuery.data, isCampusScope]
  );
  const selectedDepartment =
    departments.find((department) => department.id === (selectedDepartmentIdState ?? "")) ??
    departments[0] ??
    null;
  const selectedDepartmentId = selectedDepartment?.id || null;

  const programOptionsQuery = useProgramOptions(
    {
      semesterId: selectedSemesterId ?? "",
      departmentId: isCampusScope ? (selectedDepartmentId ?? undefined) : undefined,
      limit: 100,
    },
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
      departmentId: isCampusScope ? (selectedDepartmentId ?? undefined) : undefined,
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
    facultyList: (facultyListQuery.data?.data ?? []).filter(
      (faculty) => !isHiddenFaculty(faculty.id)
    ),
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
      (isCampusScope ? campusHeadSemestersQuery.isLoading : profileSemestersQuery.isLoading) ||
      (Boolean(selectedSemesterId) && isCampusScope && departmentOptionsQuery.isLoading) ||
      (Boolean(selectedSemesterId) && programOptionsQuery.isLoading) ||
      (Boolean(selectedSemesterId) && facultyListQuery.isLoading),
    isError:
      meQuery.isError ||
      (isCampusScope ? campusHeadSemestersQuery.isError : profileSemestersQuery.isError) ||
      departmentOptionsQuery.isError ||
      programOptionsQuery.isError ||
      facultyListQuery.isError,
    retry: () => {
      void meQuery.refetch();
      if (isCampusScope) {
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
        void facultyListQuery.refetch();
      }
    },
    setSelectedSemesterId: (value: string) => {
      setSelectedSemesterId(value);
      setSelectedDepartmentId(null);
      setSelectedProgramId(null);
      setCurrentPage(1);
    },
    departments,
    selectedDepartmentId,
    selectedDepartmentLabel: selectedDepartment?.label ?? "All Departments",
    setSelectedDepartmentId: (value: string) => {
      setSelectedDepartmentId(value || null);
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
