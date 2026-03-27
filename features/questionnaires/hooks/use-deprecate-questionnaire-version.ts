"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deprecateQuestionnaireVersion } from "@/features/questionnaires/api/questionnaire.requests";

export function useDeprecateQuestionnaireVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deprecateQuestionnaireVersion,
    onSuccess: () => {
      // Invalidate version details + version lists, but not the types query
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "questionnaires" && query.queryKey.includes("versions"),
      });
    },
  });
}
