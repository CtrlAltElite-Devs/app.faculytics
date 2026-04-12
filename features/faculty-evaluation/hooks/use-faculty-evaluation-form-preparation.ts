"use client";

import { useEffect, useMemo, useRef } from "react";

import { deleteDraft } from "@/features/questionnaires/api/questionnaire.requests";
import { useActiveQuestionnaireVersion } from "@/features/questionnaires/hooks/use-active-questionnaire-version";
import { useCheckSubmission } from "@/features/questionnaires/hooks/use-check-submission";
import { useEvaluationDraft } from "@/features/questionnaires/hooks/use-evaluation-draft";
import { deserializeQuestionnaireVersionToDraft } from "@/features/questionnaires/lib/builder-deserializer";
import { buildQuestionnairePreviewModel } from "@/features/questionnaires/lib/builder-serializer";
import type {
  FacultyEvaluationDetailContext,
  FacultyEvaluationDetailResult,
  FacultyEvaluationReadyData,
} from "@/features/faculty-evaluation/types";
import type { QuestionnaireTypeSummary } from "@/features/questionnaires/types";

type UseFacultyEvaluationFormPreparationOptions = {
  detail: FacultyEvaluationDetailContext;
  availableTypes: QuestionnaireTypeSummary[];
  selectedTypeId: string;
  selectedType: QuestionnaireTypeSummary;
};

type FacultyEvaluationPreparedResult =
  | Extract<FacultyEvaluationDetailResult, { status: "loading" | "error" }>
  | Extract<FacultyEvaluationDetailResult, { status: "no-version" | "already-submitted" }>
  | { status: "ready"; data: FacultyEvaluationReadyData };

export function useFacultyEvaluationFormPreparation(
  options: UseFacultyEvaluationFormPreparationOptions | null
): FacultyEvaluationPreparedResult {
  const detail = options?.detail ?? null;
  const availableTypes = options?.availableTypes ?? [];
  const selectedTypeId = options?.selectedTypeId ?? "";
  const selectedType = options?.selectedType ?? null;
  const effectiveSelectedTypeId = selectedTypeId ?? "";
  const activeVersionQuery = useActiveQuestionnaireVersion(effectiveSelectedTypeId, {
    enabled: Boolean(effectiveSelectedTypeId),
  });

  const evaluationParams = useMemo(
    () =>
      detail && activeVersionQuery.data
        ? {
            versionId: activeVersionQuery.data.id,
            facultyId: detail.facultyId,
            semesterId: detail.semesterId,
          }
        : null,
    [activeVersionQuery.data, detail]
  );

  const submissionCheck = useCheckSubmission(evaluationParams);
  const draftQuery = useEvaluationDraft(evaluationParams, {
    enabled:
      Boolean(evaluationParams) && submissionCheck.isSuccess && !submissionCheck.data?.submitted,
  });

  const model = useMemo(
    () =>
      activeVersionQuery.data
        ? buildQuestionnairePreviewModel({
            ...deserializeQuestionnaireVersionToDraft(activeVersionQuery.data),
            hydratedFromServer: true,
          })
        : null,
    [activeVersionQuery.data]
  );

  const draft = draftQuery.data;
  const isDraftStale = Boolean(
    draft && activeVersionQuery.data && draft.versionId !== activeVersionQuery.data.id
  );
  const staleDeletedRef = useRef(false);

  useEffect(() => {
    if (isDraftStale && draft && !staleDeletedRef.current) {
      staleDeletedRef.current = true;
      void deleteDraft(draft.id);
    }
  }, [draft, isDraftStale]);

  const defaultValues =
    draft && !isDraftStale
      ? {
          answers: draft.answers,
          qualitativeComment: draft.qualitativeComment ?? "",
        }
      : undefined;
  const draftHydrationKey = draft && !isDraftStale ? draft.updatedAt : "fresh";

  if (!detail || !selectedType) {
    return {
      status: "loading",
      message: "Preparing your evaluation form...",
      availableTypes: availableTypes ?? [],
      selectedTypeId: effectiveSelectedTypeId || null,
    };
  }

  if (activeVersionQuery.isLoading) {
    return {
      status: "loading",
      message: "Loading questionnaire...",
      availableTypes,
      selectedTypeId: effectiveSelectedTypeId,
    };
  }

  if (activeVersionQuery.isError) {
    return {
      status: "error",
      message: "Unable to load the selected questionnaire.",
      availableTypes,
      selectedTypeId: effectiveSelectedTypeId,
    };
  }

  if (!activeVersionQuery.data || !model) {
    return {
      status: "no-version",
      message: "No active questionnaire is available for the selected type.",
      availableTypes,
      selectedTypeId: effectiveSelectedTypeId,
      detail,
    };
  }

  if (submissionCheck.isLoading || draftQuery.isLoading) {
    return {
      status: "loading",
      message: "Preparing your evaluation form...",
      availableTypes,
      selectedTypeId: effectiveSelectedTypeId,
    };
  }

  if (submissionCheck.isError || draftQuery.isError) {
    return {
      status: "error",
      message: "Unable to prepare the evaluation form.",
      availableTypes,
      selectedTypeId: effectiveSelectedTypeId,
    };
  }

  if (submissionCheck.data?.submitted) {
    return {
      status: "already-submitted",
      submittedAt: submissionCheck.data.submittedAt,
      availableTypes,
      selectedTypeId: effectiveSelectedTypeId,
      detail,
    };
  }

  return {
    status: "ready",
    data: {
      ...detail,
      selectedTypeId,
      selectedType,
      availableTypes,
      activeVersion: { id: activeVersionQuery.data.id },
      model,
      defaultValues,
      draftHydrationKey,
    },
  };
}
