"use client";

import { useFacultyEvaluationDetailContext } from "@/features/faculty-evaluation/hooks/use-faculty-evaluation-detail-context";
import { useFacultyEvaluationFormPreparation } from "@/features/faculty-evaluation/hooks/use-faculty-evaluation-form-preparation";
import type { FacultyEvaluationDetailResult } from "@/features/faculty-evaluation/types";

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
  const detailContext = useFacultyEvaluationDetailContext({
    facultyId,
    facultyName,
    semesterId,
    selectedTypeId: selectedTypeIdProp,
  });

  const preparation = useFacultyEvaluationFormPreparation(
    detailContext.status === "resolved"
      ? {
          detail: detailContext.detail,
          availableTypes: detailContext.availableTypes,
          selectedTypeId: detailContext.selectedTypeId,
          selectedType: detailContext.selectedType,
        }
      : null
  );

  if (detailContext.status !== "resolved") {
    return detailContext;
  }

  return preparation;
}
