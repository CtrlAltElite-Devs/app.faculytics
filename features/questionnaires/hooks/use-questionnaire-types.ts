"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchQuestionnaireTypes } from "@/features/questionnaires/api/questionnaire.requests";
import { useAuthStore } from "@/stores/auth-store";

type UseQuestionnaireTypesOptions = {
  enabled?: boolean;
};

export function useQuestionnaireTypes(options?: UseQuestionnaireTypesOptions) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["questionnaires", "types", token],
    enabled: Boolean(token) && isEnabled,
    queryFn: fetchQuestionnaireTypes,
  });
}
