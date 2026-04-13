import {
  resolveQuestionnaireType,
  resolveQuestionnaireTypeLabel,
} from "@/features/questionnaires/types";
import type { FacultyReportResponseDto } from "@/features/faculty-analytics/types";

export function buildFacultyReportHref(
  pathname: string,
  currentParams: URLSearchParams,
  updates: Record<string, string | null>
) {
  const nextParams = new URLSearchParams(currentParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (value && value.trim().length > 0) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
  });

  const query = nextParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function resolvePositiveIntegerParam(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function formatFacultyReportScore(value: number | null) {
  if (value === null) {
    return "N/A";
  }

  return Number(value.toFixed(2)).toString();
}

export function resolveFacultyReportQuestionnaireTypeCode(value: string | null) {
  return resolveQuestionnaireType(value);
}

export function resolveFacultyReportQuestionnaireTypeLabel(code: string, name?: string | null) {
  return resolveQuestionnaireTypeLabel(code, name ?? undefined);
}

export function hasFacultyReportAnalyticsData(
  report: FacultyReportResponseDto,
  commentsCount: number
) {
  const hasInterpretation =
    typeof report.overallInterpretation === "string" &&
    report.overallInterpretation.trim().length > 0;

  return (
    report.submissionCount > 0 ||
    report.sections.length > 0 ||
    commentsCount > 0 ||
    report.overallRating !== null ||
    hasInterpretation
  );
}
