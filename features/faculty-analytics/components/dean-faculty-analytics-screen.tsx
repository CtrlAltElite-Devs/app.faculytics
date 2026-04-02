"use client";

import { DeanAnalyticsAsyncContent } from "@/features/faculty-analytics/components/dean-analytics-async-content";
import { DeanFacultyAnalysisTable } from "@/features/faculty-analytics/components/dean-faculty-analysis-table";
import { useDeanFacultyAnalyticsListViewModel } from "@/features/faculty-analytics/hooks/use-dean-faculty-analytics-list-view-model";

export function DeanFacultyAnalyticsScreen() {
  const { facultyAnalysis, isLoading, isError, retry } = useDeanFacultyAnalyticsListViewModel();

  const emptyState =
    facultyAnalysis.length === 0
      ? {
          description:
            "Faculty analytics will appear here once evaluation records are available for the selected department.",
        }
      : null;

  return (
    <DeanAnalyticsAsyncContent
      isLoading={isLoading}
      isError={isError}
      onRetry={retry}
      loadingMessage="Loading faculties..."
      errorMessage="Unable to load the faculties list."
      emptyState={emptyState}
    >
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <DeanFacultyAnalysisTable facultyAnalysis={facultyAnalysis} />
      </section>
    </DeanAnalyticsAsyncContent>
  );
}
