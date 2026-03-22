import { resolveApiErrorMessage } from "@/lib/api-errors";

export function resolveQuestionnaireActionErrorMessage(error: unknown, fallback: string) {
  return resolveApiErrorMessage(error, fallback);
}
