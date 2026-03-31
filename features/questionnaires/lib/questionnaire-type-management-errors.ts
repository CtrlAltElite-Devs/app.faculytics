import { isAxiosErrorWithStatus, resolveApiErrorMessage } from "@/lib/api-errors";

const QUESTIONNAIRE_TYPE_CONFLICT_MESSAGE = "A questionnaire type with that code already exists.";
const QUESTIONNAIRE_TYPE_SYSTEM_DELETE_MESSAGE = "System questionnaire types cannot be deleted.";
const QUESTIONNAIRE_TYPE_IN_USE_DELETE_MESSAGE =
  "Cannot delete a type that already has an associated questionnaire.";

export function resolveCreateQuestionnaireTypeManagementErrorMessage(
  error: unknown,
  fallback: string
) {
  if (isAxiosErrorWithStatus(error, 409)) {
    return QUESTIONNAIRE_TYPE_CONFLICT_MESSAGE;
  }

  return resolveApiErrorMessage(error, fallback);
}

export function resolveDeleteQuestionnaireTypeManagementErrorMessage(
  error: unknown,
  fallback: string
) {
  if (isAxiosErrorWithStatus(error, 403)) {
    return QUESTIONNAIRE_TYPE_SYSTEM_DELETE_MESSAGE;
  }

  if (isAxiosErrorWithStatus(error, 409)) {
    return QUESTIONNAIRE_TYPE_IN_USE_DELETE_MESSAGE;
  }

  return resolveApiErrorMessage(error, fallback);
}
