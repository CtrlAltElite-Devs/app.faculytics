"use client";

import { useQuery } from "@tanstack/react-query";

import { checkSubmission } from "@/features/questionnaires/api/questionnaire.requests";
import { useAuthStore } from "@/stores/auth-store";
import type { CheckSubmissionParams } from "@/features/questionnaires/types";

type UseCheckSubmissionOptions = {
  enabled?: boolean;
};

export function useCheckSubmission(
  params: CheckSubmissionParams | null,
  options?: UseCheckSubmissionOptions,
) {
  const token = useAuthStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ["questionnaires", "submissions", "check", params],
    enabled: Boolean(token) && Boolean(params) && isEnabled,
    queryFn: () => {
      if (!params) throw new Error("Check submission params are required.");
      return checkSubmission(params);
    },
  });
}
