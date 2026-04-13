"use client";

import { getEvaluatorQuestionnaireTypes } from "@/features/faculty-evaluation/lib/questionnaire-types";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import type {
  FacultyEvaluationDetailContext,
  FacultyEvaluationDetailResult,
} from "@/features/faculty-evaluation/types";

type UseFacultyEvaluationDetailContextOptions = {
  facultyId: string;
  facultyName?: string;
  semesterId: string;
  selectedTypeId?: string | null;
};

type FacultyEvaluationResolvedContext = {
  status: "resolved";
  detail: FacultyEvaluationDetailContext;
  availableTypes: ReturnType<typeof getEvaluatorQuestionnaireTypes>;
  selectedTypeId: string;
  selectedType: ReturnType<typeof getEvaluatorQuestionnaireTypes>[number];
};

type FacultyEvaluationUnresolvedContext = Exclude<
  FacultyEvaluationDetailResult,
  | { status: "ready"; data: unknown }
  | { status: "already-submitted"; detail: unknown }
  | { status: "no-version"; detail: unknown }
> & {
  status: "loading" | "error" | "missing-context" | "no-types";
};

export function useFacultyEvaluationDetailContext({
  facultyId,
  facultyName,
  semesterId,
  selectedTypeId: selectedTypeIdProp,
}: UseFacultyEvaluationDetailContextOptions):
  | FacultyEvaluationResolvedContext
  | FacultyEvaluationUnresolvedContext {
  const typesQuery = useQuestionnaireTypes();
  const availableTypes = getEvaluatorQuestionnaireTypes(typesQuery.data);
  const detail: FacultyEvaluationDetailContext = {
    facultyId,
    facultyName,
    semesterId,
  };

  if (!facultyId || !semesterId) {
    return {
      status: "missing-context",
      message: "Missing faculty evaluation context. Start from the evaluation list page.",
      availableTypes,
      selectedTypeId: null,
    };
  }

  if (!selectedTypeIdProp) {
    return {
      status: "missing-context",
      message: "Missing questionnaire type. Start from the evaluation list page.",
      availableTypes,
      selectedTypeId: null,
    };
  }

  if (typesQuery.isLoading) {
    return {
      status: "loading",
      message: "Loading questionnaire types...",
      availableTypes,
      selectedTypeId: selectedTypeIdProp,
    };
  }

  if (typesQuery.isError) {
    return {
      status: "error",
      message: "Unable to load questionnaire types.",
      availableTypes,
      selectedTypeId: selectedTypeIdProp,
    };
  }

  const selectedType = availableTypes.find((type) => type.id === selectedTypeIdProp) ?? null;

  if (!selectedType) {
    return {
      status: "no-types",
      message: "No questionnaire types are currently available for evaluation.",
      availableTypes,
      selectedTypeId: selectedTypeIdProp,
    };
  }

  return {
    status: "resolved",
    detail,
    availableTypes,
    selectedTypeId: selectedType.id,
    selectedType,
  };
}
