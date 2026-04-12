"use client";

import { useEffect, useMemo, useRef } from "react";

import { deleteDraft } from "@/features/questionnaires/api/questionnaire.requests";
import { deserializeQuestionnaireVersionToDraft } from "@/features/questionnaires/lib/builder-deserializer";
import { buildQuestionnairePreviewModel } from "@/features/questionnaires/lib/builder-serializer";
import { useActiveQuestionnaireVersion } from "@/features/questionnaires/hooks/use-active-questionnaire-version";
import { useCheckSubmission } from "@/features/questionnaires/hooks/use-check-submission";
import { useEvaluationDraft } from "@/features/questionnaires/hooks/use-evaluation-draft";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import type {
  FacultyEvaluationDetailContext,
  FacultyEvaluationDetailResult,
} from "@/features/faculty-evaluation/types";

const STUDENT_ONLY_QUESTIONNAIRE_TYPE_CODE = "FACULTY_FEEDBACK";

type UseFacultyEvaluationDetailOptions = {
  facultyId: string;
  facultyName?: string;
  semesterId: string;
  selectedTypeId?: string | null;
};

export function useFacultyEvaluationDetail({
  facultyId,
  facultyName,
  semesterId,
  selectedTypeId: selectedTypeIdProp,
}: UseFacultyEvaluationDetailOptions): FacultyEvaluationDetailResult {
  const typesQuery = useQuestionnaireTypes();

  const availableTypes =
    typesQuery.data?.filter((type) => type.code !== STUDENT_ONLY_QUESTIONNAIRE_TYPE_CODE) ?? [];
  const effectiveSelectedTypeId = selectedTypeIdProp ?? null;
  const selectedType =
    availableTypes.find((type) => type.id === effectiveSelectedTypeId) ?? availableTypes[0] ?? null;
  const selectedTypeId = selectedType?.id ?? null;

  const activeVersionQuery = useActiveQuestionnaireVersion(selectedTypeId, {
    enabled: Boolean(selectedTypeId),
  });

  const detail: FacultyEvaluationDetailContext = {
    facultyId,
    facultyName,
    semesterId,
  };

  const evaluationParams = useMemo(
    () =>
      activeVersionQuery.data
        ? {
            versionId: activeVersionQuery.data.id,
            facultyId,
            semesterId,
          }
        : null,
    [activeVersionQuery.data, facultyId, semesterId]
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

  if (!facultyId || !semesterId) {
    return {
      status: "missing-context",
      message: "Missing faculty evaluation context. Start from the evaluation list page.",
      availableTypes,
      selectedTypeId,
    };
  }

  if (!selectedTypeIdProp) {
    return {
      status: "missing-context",
      message: "Missing questionnaire type. Start from the evaluation list page.",
      availableTypes,
      selectedTypeId,
    };
  }

  if (typesQuery.isLoading) {
    return {
      status: "loading",
      message: "Loading questionnaire types...",
      availableTypes,
      selectedTypeId,
    };
  }

  if (typesQuery.isError) {
    return {
      status: "error",
      message: "Unable to load questionnaire types.",
      availableTypes,
      selectedTypeId,
    };
  }

  if (availableTypes.length === 0 || !selectedType || !selectedTypeId) {
    return {
      status: "no-types",
      message: "No questionnaire types are currently available for evaluation.",
      availableTypes,
      selectedTypeId,
    };
  }

  if (activeVersionQuery.isLoading) {
    return {
      status: "loading",
      message: "Loading questionnaire...",
      availableTypes,
      selectedTypeId,
    };
  }

  if (activeVersionQuery.isError) {
    return {
      status: "error",
      message: "Unable to load the selected questionnaire.",
      availableTypes,
      selectedTypeId,
    };
  }

  if (!activeVersionQuery.data || !model) {
    return {
      status: "no-version",
      message: "No active questionnaire is available for the selected type.",
      availableTypes,
      selectedTypeId,
      detail,
    };
  }

  if (submissionCheck.isLoading || draftQuery.isLoading) {
    return {
      status: "loading",
      message: "Preparing your evaluation form...",
      availableTypes,
      selectedTypeId,
    };
  }

  if (submissionCheck.isError || draftQuery.isError) {
    return {
      status: "error",
      message: "Unable to prepare the evaluation form.",
      availableTypes,
      selectedTypeId,
    };
  }

  if (submissionCheck.data?.submitted) {
    return {
      status: "already-submitted",
      submittedAt: submissionCheck.data.submittedAt,
      availableTypes,
      selectedTypeId,
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
