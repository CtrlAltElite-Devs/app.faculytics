"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchMyEnrollments } from "@/network/requests/enrollments";
import { useAuthStore } from "@/stores/auth-store";
import type { GetMyEnrollmentsQuery } from "@/types/enrollments";

type UseMyEnrollmentsOptions = {
  enabled?: boolean;
};

export function useMyEnrollments(
  query?: Partial<GetMyEnrollmentsQuery>,
  options?: UseMyEnrollmentsOptions
) {
  const token = useAuthStore((state) => state.token);
  const page = query?.page ?? 1;
  const limit = query?.limit ?? 100;
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["enrollments", "me", token, page, limit],
    enabled: Boolean(token) && isEnabled,
    queryFn: () => fetchMyEnrollments({ page, limit }),
  });
}
