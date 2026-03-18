import { isAxiosError } from "axios";

export function resolveQuestionnaireActionErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error) && typeof error.response?.data === "object" && error.response?.data !== null) {
    const message = "message" in error.response.data ? error.response.data.message : null;

    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return fallback;
}
