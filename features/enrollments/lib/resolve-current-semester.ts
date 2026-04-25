import type { SemesterOptionDto } from "@/features/faculty-analytics/types";

/**
 * Picks the academic term that is currently in progress for the given list of
 * semesters. "Currently in progress" means `startDate <= now < endDate` (with
 * a missing `endDate` treated as open-ended). If no semester is active right
 * now (e.g. between terms), falls back to the most recent semester by
 * `startDate DESC` so the UI still renders the student's last known term
 * instead of an empty screen.
 *
 * The input is assumed to already be scoped to a single campus by the caller.
 */
export function resolveCurrentSemester(
  semesters: SemesterOptionDto[],
  now: Date = new Date()
): SemesterOptionDto | null {
  if (semesters.length === 0) return null;

  const nowMs = now.getTime();

  const active = semesters.find((semester) => {
    const start = new Date(semester.startDate).getTime();
    const end = semester.endDate ? new Date(semester.endDate).getTime() : Number.POSITIVE_INFINITY;
    return start <= nowMs && nowMs < end;
  });

  if (active) return active;

  const sorted = [...semesters].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return sorted[0] ?? null;
}
