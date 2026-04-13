"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { submitEvaluation } from "@/features/questionnaires/api/questionnaire.requests";

export function useRoleSubmitFacultyEvaluation(returnHref: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitEvaluation,
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error("You have already submitted this evaluation.");
        router.push(returnHref);
        return;
      }

      toast.error("Failed to submit evaluation. Please try again.");
    },
  });

  const invalidateAndNavigate = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: ["questionnaires", "submissions", "check"],
    });
    void queryClient.invalidateQueries({ queryKey: ["questionnaires", "drafts"] });
    void queryClient.invalidateQueries({ queryKey: ["faculty-evaluation", "faculty-list"] });
    router.push(returnHref);
  }, [queryClient, returnHref, router]);

  return { ...mutation, invalidateAndNavigate };
}
