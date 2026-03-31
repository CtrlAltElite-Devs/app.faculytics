import {
  DEFAULT_QUESTIONNAIRE_TYPE,
  QUESTIONNAIRE_TYPES,
  getQuestionnaireTypeLabel,
} from "@/features/questionnaires/constants";
import type {
  QuestionnaireTypeCode,
  QuestionnaireTypeSummary,
} from "@/features/questionnaires/types";

export function buildQuestionnaireTypeOptions(
  typeSummaries: QuestionnaireTypeSummary[]
): QuestionnaireTypeSummary[] {
  if (typeSummaries.length > 0) {
    return typeSummaries;
  }

  return QUESTIONNAIRE_TYPES.map((code) => ({
    id: code,
    name: getQuestionnaireTypeLabel(code),
    code,
    description: null,
    isSystem: true,
    questionnaireId: null,
    questionnaireTitle: null,
    questionnaireStatus: null,
  }));
}

export function resolveActiveQuestionnaireType({
  requestedType,
  availableTypeOptions,
  isResolved,
}: {
  requestedType: QuestionnaireTypeCode;
  availableTypeOptions: QuestionnaireTypeSummary[];
  isResolved: boolean;
}) {
  if (!isResolved) {
    return requestedType;
  }

  const availableTypes = availableTypeOptions.map((summary) => summary.code);
  return availableTypes.includes(requestedType)
    ? requestedType
    : (availableTypes[0] ?? DEFAULT_QUESTIONNAIRE_TYPE);
}
