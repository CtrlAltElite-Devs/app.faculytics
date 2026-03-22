"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchDraft } from "@/features/questionnaires/api/questionnaire.requests";
import { useAuthStore } from "@/stores/auth-store";
import type { FetchDraftParams } from "@/features/questionnaires/types";

type UseEvaluationDraftOptions = {
  enabled?: boolean;
};

export function useEvaluationDraft(
  params: FetchDraftParams | null,
  options?: UseEvaluationDraftOptions,
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["questionnaires", "drafts", params],
    enabled: Boolean(token) && Boolean(params) && isEnabled,
    queryFn: () => {
      if (!params) throw new Error("Draft params are required.");
      return fetchDraft(params);
    },
  });
}
