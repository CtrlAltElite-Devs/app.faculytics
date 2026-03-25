import { isAxiosError } from "axios";

/**
 * Extracts a human-readable error message from an Axios error response.
 * Returns `null` if the error is not an Axios error or has no message.
 */
export function extractAxiosErrorMessage(error: unknown): string | null {
  if (
    isAxiosError(error) &&
    typeof error.response?.data === "object" &&
    error.response.data !== null
  ) {
    const message = "message" in error.response.data ? error.response.data.message : null;

    if (typeof message === "string" && message.length > 0) {
      return message;
    }

    if (Array.isArray(message) && message.length > 0) {
      return message[0];
    }
  }

  return null;
}

/**
 * Resolves an error to a user-facing message string.
 * Tries to extract the message from an Axios error response, falls back to `fallback`.
 */
export function resolveApiErrorMessage(error: unknown, fallback: string): string {
  return extractAxiosErrorMessage(error) ?? fallback;
}

/**
 * Checks whether the error is an Axios error with the given HTTP status code.
 */
export function isAxiosErrorWithStatus(error: unknown, status: number): boolean {
  return isAxiosError(error) && error.response?.status === status;
}
