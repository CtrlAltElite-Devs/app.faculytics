"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/features/auth/api/auth.requests";
import { useAuthStore } from "@/stores/auth-store";

export function useMe() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["auth", "me"],
    enabled: Boolean(token),
    queryFn: fetchMe,
  });
}
