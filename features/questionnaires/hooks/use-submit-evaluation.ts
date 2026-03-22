"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { submitEvaluation } from "@/features/questionnaires/api/questionnaire.requests";

export function useSubmitEvaluation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitEvaluation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionnaires", "submissions", "check"] });
      queryClient.invalidateQueries({ queryKey: ["questionnaires", "drafts"] });
      toast.success("Evaluation submitted successfully.");
      router.push("/student/courses");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error("You have already submitted this evaluation.");
        router.push("/student/courses");
        return;
      }
      toast.error("Failed to submit evaluation. Please try again.");
    },
  });
}
