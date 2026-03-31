"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchFacultyList } from "@/features/dean/api/dean.requests";
import type { FacultyListQuery } from "@/features/dean/types";
import { useAuthStore } from "@/stores/auth-store";

type UseFacultyListOptions = {
  enabled?: boolean;
};

export function useFacultyList(
  query: FacultyListQuery,
  options?: UseFacultyListOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;
  const { semesterId, page = 1, limit = 100, search, departmentId, programId } = query;

  return useQuery({
    queryKey: [
      "dean",
      "faculty",
      token,
      semesterId,
      page,
      limit,
      search ?? "",
      departmentId ?? "",
      programId ?? "",
    ],
    enabled: Boolean(token) && Boolean(semesterId) && isEnabled,
    queryFn: () =>
      fetchFacultyList({
        semesterId,
        page,
        limit,
        search,
        departmentId,
        programId,
      }),
  });
}
