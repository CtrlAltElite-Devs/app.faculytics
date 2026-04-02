"use client";

import { useState } from "react";

import {
  getDeanDashboardViewModel,
  type DeanAcademicYear,
} from "@/features/faculty-analytics/lib/dean-analytics-view-model";

const dashboardViewModel = getDeanDashboardViewModel();
const noop = () => undefined;

export function useDeanDashboardViewModel() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<DeanAcademicYear>(
    dashboardViewModel.defaultAcademicYear
  );

  return {
    ...dashboardViewModel,
    selectedAcademicYear,
    setSelectedAcademicYear,
    isLoading: false,
    isError: false,
    retry: noop,
  };
}
