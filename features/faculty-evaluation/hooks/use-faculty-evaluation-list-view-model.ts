"use client";

import { useEffect } from "react";

import { useFacultyEvaluationFilters } from "@/features/faculty-evaluation/hooks/use-faculty-evaluation-filters";
import { useFacultyEvaluationListData } from "@/features/faculty-evaluation/hooks/use-faculty-evaluation-list-data";

export function useFacultyEvaluationListViewModel() {
  const {
    selectedSemesterIdParam,
    selectedProgramIdParam,
    searchValue,
    deferredSearchValue,
    searchParamsString,
    syncFilters,
    setSearchValue,
    setSelectedProgramId,
    setSelectedSemesterId,
  } = useFacultyEvaluationFilters();
  const data = useFacultyEvaluationListData({
    selectedSemesterIdParam,
    selectedProgramIdParam,
    deferredSearchValue,
  });

  useEffect(() => {
    syncFilters({
      selectedSemesterId: data.selectedSemesterId,
      selectedProgramId: data.selectedProgramId,
    });
  }, [
    data.selectedProgramId,
    data.selectedSemesterId,
    searchParamsString,
    searchValue,
    syncFilters,
  ]);

  return {
    ...data,
    searchValue,
    setSelectedSemesterId,
    setSelectedProgramId,
    setSearchValue,
  };
}
