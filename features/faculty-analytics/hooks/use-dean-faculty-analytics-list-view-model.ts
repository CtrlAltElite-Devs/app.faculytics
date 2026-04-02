"use client";

import { getDeanFacultyAnalyticsListViewModel } from "@/features/faculty-analytics/lib/dean-analytics-view-model";

const noop = () => undefined;

export function useDeanFacultyAnalyticsListViewModel() {
  return {
    ...getDeanFacultyAnalyticsListViewModel(),
    isLoading: false,
    isError: false,
    retry: noop,
  };
}
