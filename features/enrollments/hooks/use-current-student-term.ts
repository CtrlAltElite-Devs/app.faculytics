"use client";

import { useMemo } from "react";

import { useMe } from "@/features/auth/hooks/use-me";
import { resolveCurrentSemester } from "@/features/enrollments/lib/resolve-current-semester";
import { useSemesterOptions } from "@/features/faculty-analytics/hooks/use-semester-options";
import type { SemesterOptionDto } from "@/features/faculty-analytics/types";

export type CurrentStudentTermResult =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "no-campus" }
  | { status: "no-semester" }
  | { status: "ready"; semester: SemesterOptionDto };

/**
 * Resolves the academic term the student is currently in, scoped to their
 * campus. Chains useMe → useSemesterOptions(campusId) → resolveCurrentSemester.
 *
 * Pure frontend resolution: GET /enrollments/me returns every semester a
 * student has enrollments in, and the student UI needs to show only the
 * current one (no semester switcher). FAC-146 added start/end dates to the
 * semester list response, which lets us pick the active term client-side.
 */
export function useCurrentStudentTerm(): CurrentStudentTermResult {
  const meQuery = useMe();
  const campusId = meQuery.data?.campus?.id;

  const semestersQuery = useSemesterOptions(campusId ? { campusId } : undefined, {
    enabled: Boolean(campusId),
  });

  const resolved = useMemo(() => {
    if (!semestersQuery.data) return null;
    return resolveCurrentSemester(semestersQuery.data.data);
  }, [semestersQuery.data]);

  if (meQuery.isLoading || (campusId && semestersQuery.isLoading)) {
    return { status: "loading" };
  }

  if (meQuery.isError) {
    return { status: "error", message: "Unable to load your profile." };
  }

  if (!campusId) {
    return { status: "no-campus" };
  }

  if (semestersQuery.isError) {
    return { status: "error", message: "Unable to load semesters." };
  }

  if (!resolved) {
    return { status: "no-semester" };
  }

  return { status: "ready", semester: resolved };
}
