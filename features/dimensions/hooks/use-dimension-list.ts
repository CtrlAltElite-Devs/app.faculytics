"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchDimensions } from "@/features/dimensions/api/dimension.requests";
import type { ListDimensionsRequest } from "@/features/dimensions/types";
import { useAuthStore } from "@/stores/auth-store";

type UseDimensionListOptions = {
  enabled?: boolean;
};

export function useDimensionList(
  filters: ListDimensionsRequest,
  options?: UseDimensionListOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["dimensions", "list", filters, token],
    enabled: Boolean(token) && isEnabled,
    placeholderData: keepPreviousData,
    queryFn: () => fetchDimensions(filters),
  });
}
