"use client";

import { useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";

import { saveDraft } from "@/features/questionnaires/api/questionnaire.requests";
import type {
  QuestionnaireFormValues,
  SaveDraftPayload,
} from "@/features/questionnaires/types";

const DEBOUNCE_MS = 3000;

type DraftSaveStatus = "idle" | "saving" | "saved" | "error";

type UseAutoSaveDraftOptions = {
  versionId: string;
  facultyId: string;
  semesterId: string;
  courseId?: string;
  onStatusChange?: (status: DraftSaveStatus) => void;
};

export function useSaveDraft() {
  return useMutation({
    mutationFn: saveDraft,
  });
}

export function useAutoSaveDraft({
  versionId,
  facultyId,
  semesterId,
  courseId,
  onStatusChange,
}: UseAutoSaveDraftOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mutation = useSaveDraft();

  const debouncedSave = useCallback(
    (values: QuestionnaireFormValues) => {
      // Don't save empty forms
      if (Object.keys(values.answers).length === 0) return;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        const payload: SaveDraftPayload = {
          versionId,
          facultyId,
          semesterId,
          courseId,
          answers: values.answers,
          qualitativeComment: values.qualitativeComment || undefined,
        };

        onStatusChange?.("saving");

        mutation.mutate(payload, {
          onSuccess: () => {
            onStatusChange?.("saved");
          },
          onError: () => {
            // Silent retry once
            mutation.mutate(payload, {
              onSuccess: () => {
                onStatusChange?.("saved");
              },
              onError: () => {
                // Ignore — draft save is best-effort
                onStatusChange?.("error");
              },
            });
          },
        });
      }, DEBOUNCE_MS);
    },
    [versionId, facultyId, semesterId, courseId, mutation, onStatusChange],
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { debouncedSave, cancel, status: mutation.status };
}
