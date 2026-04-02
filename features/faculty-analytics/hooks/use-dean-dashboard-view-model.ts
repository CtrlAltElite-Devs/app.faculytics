"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";

import {
  getDeanDashboardViewModel,
  type DeanAcademicYear,
} from "@/features/faculty-analytics/lib/dean-analytics-view-model";

const dashboardViewModel = getDeanDashboardViewModel();
const noop = () => undefined;

export function useDeanDashboardViewModel() {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<DeanAcademicYear>(
    dashboardViewModel.defaultAcademicYear
  );

  return {
    ...dashboardViewModel,
    selectedAcademicYear,
    setSelectedAcademicYear,
    isLoading: false,
    isRefreshing,
    isError: false,
    retry: noop,
    refresh: () => {
      startTransition(() => {
        router.refresh();
      });
    },
  };
}
