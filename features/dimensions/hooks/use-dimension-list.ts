"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchDimensions } from "@/features/dimensions/api/dimension.requests";
import type { ListDimensionsRequest } from "@/features/dimensions/types";
import { useAuthStore } from "@/stores/auth-store";

export function useDimensionList(filters: ListDimensionsRequest) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["dimensions", "list", filters, token],
    enabled: Boolean(token),
    placeholderData: keepPreviousData,
    queryFn: () => fetchDimensions(filters),
  });
}
