"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { submitEvaluation } from "@/features/questionnaires/api/questionnaire.requests";

export function useSubmitEvaluation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitEvaluation,
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error("You have already submitted this evaluation.");
        router.push("/student/courses");
        return;
      }
      toast.error("Failed to submit evaluation. Please try again.");
    },
  });

  /**
   * Invalidates submission/draft caches and navigates to courses.
   * Called by the UI after the user acknowledges the success dialog — NOT on mutation
   * success — to prevent `useEvaluationData` from flipping to "already-submitted" and
   * unmounting the form before the dialog is seen.
   */
  const invalidateAndNavigate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["questionnaires", "submissions", "check"] });
    queryClient.invalidateQueries({ queryKey: ["questionnaires", "drafts"] });
    router.push("/student/courses");
  }, [queryClient, router]);

  return { ...mutation, invalidateAndNavigate };
}
