"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useMe } from "@/features/auth/hooks/use-me";
import { FacultyReportScreen } from "@/features/faculty-analytics/components/faculty-report-screen";
import { ScopedAnalyticsErrorState } from "@/features/faculty-analytics/components/scoped-analytics-error-state";
import { ScopedAnalyticsLoadingState } from "@/features/faculty-analytics/components/scoped-analytics-loading-state";
import { useSemesterOptions } from "@/features/faculty-analytics/hooks/use-semester-options";
import { mapSemesterOptionsToViewModel } from "@/features/faculty-analytics/lib/scoped-analytics-view-model";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const meQuery = useMe();

  const campusId = meQuery.data?.campus?.id;
  const semestersQuery = useSemesterOptions(campusId ? { campusId } : undefined, {
    enabled: Boolean(campusId),
  });

  const semesters = useMemo(
    () => mapSemesterOptionsToViewModel(semestersQuery.data?.data ?? []),
    [semestersQuery.data]
  );

  const urlSemesterId = searchParams.get("semesterId");

  // Auto-resolve: when no semesterId is present in the URL (faculty landed
  // directly on /faculty/analytics), pick the first available semester and
  // inject it into the URL so the downstream view-model has context.
  useEffect(() => {
    if (urlSemesterId || semesters.length === 0) return;
    const first = semesters[0];
    const params = new URLSearchParams(searchParams.toString());
    params.set("semesterId", first.id);
    params.set("semesterLabel", first.label);
    router.replace(`${pathname}?${params.toString()}`);
  }, [urlSemesterId, semesters, searchParams, pathname, router]);

  if (meQuery.isLoading || (Boolean(campusId) && semestersQuery.isLoading)) {
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

  if (semesters.length === 0 && semestersQuery.isSuccess) {
    return (
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <ScopedAnalyticsErrorState
          onRetry={() => void semestersQuery.refetch()}
          message="No semesters available for your campus yet."
        />
      </section>
    );
  }

  // Wait for the redirect effect to inject semesterId into the URL.
  if (!urlSemesterId) {
    return (
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <ScopedAnalyticsLoadingState message="Loading your analytics..." />
      </section>
    );
  }

  return <FacultyReportScreen facultyId={meQuery.data.id} />;
}
