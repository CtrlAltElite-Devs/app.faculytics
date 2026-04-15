"use client";

import { useMe } from "@/features/auth/hooks/use-me";
import { FacultyReportScreen } from "@/features/faculty-analytics/components/faculty-report-screen";
import { ScopedAnalyticsErrorState } from "@/features/faculty-analytics/components/scoped-analytics-error-state";
import { ScopedAnalyticsLoadingState } from "@/features/faculty-analytics/components/scoped-analytics-loading-state";

// FAC-135 Phase D (Task D1): Faculty self-view entry point.
//
// Accessor choice: `me.data.id` is the canonical Faculty profile id used by
// the API's AnalysisAccessService as the redaction pivot — see
// `api.faculytics/src/modules/analysis/services/analysis-access.service.ts`
// comment: "user.id === pipeline.faculty.id is the canonical matching
// precedent". MeResponse does NOT carry a separate `facultyId` field; the
// backend treats the auth user's id and the Faculty profile id as
// equivalent for Faculty-role users.
export default function FacultyAnalyticsPage() {
  const meQuery = useMe();

  if (meQuery.isLoading) {
    return (
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <ScopedAnalyticsLoadingState message="Loading your analytics..." />
      </section>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return (
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <ScopedAnalyticsErrorState
          onRetry={() => void meQuery.refetch()}
          message="Unable to load your profile. Please try again."
        />
      </section>
    );
  }

  return <FacultyReportScreen facultyId={meQuery.data.id} />;
}
