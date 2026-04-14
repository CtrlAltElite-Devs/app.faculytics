"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchFacultyEnrollments } from "@/features/faculty-analytics/api/faculty-analytics.requests";
import { useAuthStore } from "@/stores/auth-store";

type UseFacultyEnrollmentsParams = {
  facultyId: string;
  semesterId: string;
  page?: number;
  limit?: number;
};

type UseFacultyEnrollmentsOptions = {
  enabled?: boolean;
};

export function useFacultyEnrollments(
  params: UseFacultyEnrollmentsParams,
  options?: UseFacultyEnrollmentsOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;

  return useQuery({
    queryKey: [
      "faculty-analytics",
      "faculty-enrollments",
      params.facultyId,
      params.semesterId,
      page,
      limit,
      token,
    ],
    enabled: Boolean(token) && Boolean(params.facultyId) && Boolean(params.semesterId) && isEnabled,
    queryFn: () =>
      fetchFacultyEnrollments({
        facultyId: params.facultyId,
        semesterId: params.semesterId,
        page,
        limit,
      }),
  });
}
