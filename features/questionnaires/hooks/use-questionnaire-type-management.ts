"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchQuestionnaireTypeManagementDetail,
  fetchQuestionnaireTypeManagementList,
} from "@/features/questionnaires/api/questionnaire.requests";
import { questionnaireManagementQueryKeys } from "@/features/questionnaires/lib/query-keys";
import type { ListQuestionnaireTypeManagementRequest } from "@/features/questionnaires/types";
import { useAuthStore } from "@/stores/auth-store";

type UseQuestionnaireTypeManagementOptions = {
  enabled?: boolean;
};

export function useQuestionnaireTypeManagementList(
  filters?: ListQuestionnaireTypeManagementRequest,
  options?: UseQuestionnaireTypeManagementOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: questionnaireManagementQueryKeys.list(filters, token),
    enabled: Boolean(token) && isEnabled,
    queryFn: () => fetchQuestionnaireTypeManagementList(filters),
  });
}

export function useQuestionnaireTypeManagementDetail(
  id: string | null,
  options?: UseQuestionnaireTypeManagementOptions
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: questionnaireManagementQueryKeys.detail(id, token),
    enabled: Boolean(token) && Boolean(id) && isEnabled,
    queryFn: async () => {
      if (!id) {
        throw new Error("Questionnaire type ID is required.");
      }

      return fetchQuestionnaireTypeManagementDetail(id);
    },
  });
}
