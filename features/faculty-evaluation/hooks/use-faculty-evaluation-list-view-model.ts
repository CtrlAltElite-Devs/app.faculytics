"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useMe } from "@/features/auth/hooks/use-me";
import {
  ALL_PROGRAMS_LABEL,
  ALL_PROGRAMS_VALUE,
} from "@/features/faculty-analytics/constants/filters";
import { useScopedFacultyList } from "@/features/faculty-evaluation/hooks/use-scoped-faculty-list";
import type { FacultyEvaluationRow } from "@/features/faculty-evaluation/types";
import {
  mapProgramOptionsToViewModel,
  mapSemesterOptionsToViewModel,
} from "@/features/faculty-analytics/lib/dean-analytics-view-model";
import { useProgramOptions } from "@/features/faculty-analytics/hooks/use-program-options";
import { useSemesterOptions } from "@/features/faculty-analytics/hooks/use-semester-options";

const DEFAULT_LIMIT = 100;

function mapRows(
  facultyRows: readonly {
    id: string;
    fullName: string;
    profilePicture: string | null;
    subjects: string[];
  }[]
): FacultyEvaluationRow[] {
  return facultyRows.map((faculty) => ({
    id: faculty.id,
    fullName: faculty.fullName,
    profilePicture: faculty.profilePicture,
    subjects: faculty.subjects,
  }));
}

function setSearchParams(
  pathname: string,
  currentParams: URLSearchParams,
  updates: Record<string, string | null>
) {
  const nextParams = new URLSearchParams(currentParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (value && value.trim().length > 0) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
  });

  const query = nextParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function useFacultyEvaluationListViewModel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const searchParamValue = searchParams.get("search") ?? "";
  const selectedSemesterIdParam = searchParams.get("semesterId");
  const selectedProgramIdParam = searchParams.get("programId");

  const [searchValue, setSearchValueState] = useState(searchParamValue);

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
    selectedSemesterIdParam && semesters.some((semester) => semester.id === selectedSemesterIdParam)
      ? selectedSemesterIdParam
      : (semesters[0]?.id ?? null);

  const selectedSemester =
    semesters.find((semester) => semester.id === selectedSemesterId) ?? semesters[0] ?? null;

  const programOptionsQuery = useProgramOptions(
    { semesterId: selectedSemesterId ?? "", limit: 100 },
    { enabled: Boolean(selectedSemesterId) }
  );

  const programs = useMemo(
    () => mapProgramOptionsToViewModel(programOptionsQuery.data?.data ?? []),
    [programOptionsQuery.data]
  );

  const selectedProgram =
    programs.find((program) => program.id === selectedProgramIdParam) ?? programs[0] ?? null;
  const selectedProgramId = selectedProgram?.id ?? null;

  useEffect(() => {
    setSearchValueState(searchParamValue);
  }, [searchParamValue]);

  useEffect(() => {
    if (!selectedSemesterId) return;

    const nextHref = setSearchParams(pathname, new URLSearchParams(searchParamsString), {
      semesterId: selectedSemesterId,
      programId: selectedProgramId,
      search: searchValue.trim() || null,
    });
    const currentHref = searchParamsString ? `${pathname}?${searchParamsString}` : pathname;

    if (nextHref !== currentHref) {
      router.replace(nextHref, { scroll: false });
    }
  }, [pathname, router, searchParamsString, searchValue, selectedProgramId, selectedSemesterId]);

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
    selectedProgramLabel: selectedProgram?.label ?? ALL_PROGRAMS_LABEL,
    facultyRows: mapRows(facultyListQuery.data?.data ?? []),
    totalItems: facultyListQuery.data?.meta.totalItems ?? 0,
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
      const nextHref = setSearchParams(pathname, new URLSearchParams(searchParamsString), {
        semesterId: value,
        programId: null,
      });

      router.replace(nextHref, { scroll: false });
    },
    setSelectedProgramId: (value: string) => {
      const nextHref = setSearchParams(pathname, new URLSearchParams(searchParamsString), {
        programId: value === ALL_PROGRAMS_VALUE ? null : value,
      });

      router.replace(nextHref, { scroll: false });
    },
    setSearchValue: setSearchValueState,
  };
}
