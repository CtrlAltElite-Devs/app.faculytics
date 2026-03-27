"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchDraft } from "@/features/questionnaires/api/questionnaire.requests";
import { useAuthStore } from "@/stores/auth-store";
import type { FetchDraftParams } from "@/features/questionnaires/types";

type UseEvaluationDraftOptions = {
  enabled?: boolean;
};

export function getEvaluationDraftQueryKey(params: FetchDraftParams | null) {
  return ["questionnaires", "drafts", params] as const;
}

export function useEvaluationDraft(
  params: FetchDraftParams | null,
  options?: UseEvaluationDraftOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: getEvaluationDraftQueryKey(params),
    enabled: Boolean(token) && Boolean(params) && isEnabled,
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: () => {
      if (!params) throw new Error("Draft params are required.");
      return fetchDraft(params);
    },
  });
}
