import { isAxiosErrorWithStatus, resolveApiErrorMessage } from "@/lib/api-errors";

const DIMENSION_CONFLICT_MESSAGE = "This dimension already exists, please select it from the list.";

export function resolveCreateDimensionErrorMessage(error: unknown, fallback: string) {
  if (isAxiosErrorWithStatus(error, 409)) {
    return DIMENSION_CONFLICT_MESSAGE;
  }

  return resolveApiErrorMessage(error, fallback);
}

export { DIMENSION_CONFLICT_MESSAGE };
