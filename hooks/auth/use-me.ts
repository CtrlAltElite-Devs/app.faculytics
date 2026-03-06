"use client";

import { fetchMe } from "@/network/requests/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";

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
