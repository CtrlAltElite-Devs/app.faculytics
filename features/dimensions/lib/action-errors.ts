import { isAxiosError } from "axios";

const DIMENSION_CONFLICT_MESSAGE =
  "This dimension already exists, please select it from the list.";

export function resolveCreateDimensionErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    if (error.response?.status === 409) {
      return DIMENSION_CONFLICT_MESSAGE;
    }

    if (typeof error.response?.data === "object" && error.response.data !== null) {
      const message = "message" in error.response.data ? error.response.data.message : null;

      if (typeof message === "string" && message.length > 0) {
        return message;
      }
    }
  }

  return fallback;
}

export { DIMENSION_CONFLICT_MESSAGE };
