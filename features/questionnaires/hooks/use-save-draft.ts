"use client";

import { useCallback, useEffect, useRef } from "react";
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
  const mutationRef = useRef(useSaveDraft());
  const onStatusChangeRef = useRef(onStatusChange);
  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  const debouncedSave = useCallback(
    (values: QuestionnaireFormValues) => {
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

        onStatusChangeRef.current?.("saving");

        mutationRef.current.mutate(payload, {
          onSuccess: () => {
            onStatusChangeRef.current?.("saved");
          },
          onError: () => {
            mutationRef.current.mutate(payload, {
              onSuccess: () => {
                onStatusChangeRef.current?.("saved");
              },
              onError: () => {
                onStatusChangeRef.current?.("error");
              },
            });
          },
        });
      }, DEBOUNCE_MS);
    },
    [versionId, facultyId, semesterId, courseId],
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { debouncedSave, cancel };
}
