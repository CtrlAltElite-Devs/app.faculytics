"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveDraft } from "@/features/questionnaires/api/questionnaire.requests";
import { getEvaluationDraftQueryKey } from "@/features/questionnaires/hooks/use-evaluation-draft";
import type {
  DraftResponse,
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
  const queryClient = useQueryClient();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { mutate: saveDraftMutation } = useSaveDraft();
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

        const syncDraftCache = (draft: DraftResponse) => {
          queryClient.setQueryData(
            getEvaluationDraftQueryKey({
              versionId: payload.versionId,
              facultyId: payload.facultyId,
              semesterId: payload.semesterId,
              courseId: payload.courseId,
            }),
            draft
          );
        };

        saveDraftMutation(payload, {
          onSuccess: (draft) => {
            syncDraftCache(draft);
            onStatusChangeRef.current?.("saved");
          },
          onError: () => {
            saveDraftMutation(payload, {
              onSuccess: (draft) => {
                syncDraftCache(draft);
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
    [versionId, facultyId, semesterId, courseId, queryClient, saveDraftMutation]
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => cancel, [cancel]);

  return { debouncedSave, cancel };
}
