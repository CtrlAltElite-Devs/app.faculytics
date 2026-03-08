"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchMyEnrollments } from "@/network/requests/enrollments";
import { useAuthStore } from "@/stores/auth-store";
import type { GetMyEnrollmentsQuery } from "@/types/enrollments";

export function useMyEnrollments(query?: Partial<GetMyEnrollmentsQuery>) {
  const token = useAuthStore((state) => state.token);
  const page = query?.page ?? 1;
  const limit = query?.limit ?? 100;

  return useQuery({
    queryKey: ["enrollments", "me", page, limit],
    enabled: Boolean(token),
    queryFn: () => fetchMyEnrollments({ page, limit }),
  });
}
