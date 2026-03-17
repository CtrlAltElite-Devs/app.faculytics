"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/features/auth/api/auth.requests";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Query hook for current authenticated user.
 * Executes only when there is a token in Zustand.
 */
export function useMe() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["auth", "me"],
    enabled: Boolean(token),
    queryFn: fetchMe,
  });
}
