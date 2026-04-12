import type { QuestionnaireTypeSummary } from "@/features/questionnaires/types";

export const STUDENT_ONLY_QUESTIONNAIRE_TYPE_CODE = "FACULTY_FEEDBACK";

export function getEvaluatorQuestionnaireTypes(
  questionnaireTypes: QuestionnaireTypeSummary[] | undefined
) {
  return (questionnaireTypes ?? []).filter(
    (type) => type.code !== STUDENT_ONLY_QUESTIONNAIRE_TYPE_CODE
  );
}
