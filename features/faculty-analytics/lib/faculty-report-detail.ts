import {
  resolveQuestionnaireType,
  resolveQuestionnaireTypeLabel,
} from "@/features/questionnaires/types";
import type { FacultyReportResponseDto } from "@/features/faculty-analytics/types";

const FACULTY_REPORT_INTERPRETATION_STYLE_MAP = {
  "EXCELLENT PERFORMANCE": {
    badgeClass: "badge-interpretation-excellent",
    textClass: "text-emerald-700 dark:text-emerald-300",
  },
  "VERY SATISFACTORY PERFORMANCE": {
    badgeClass: "badge-interpretation-very-satisfactory",
    textClass: "text-blue-700 dark:text-blue-300",
  },
  "SATISFACTORY PERFORMANCE": {
    badgeClass: "badge-interpretation-satisfactory",
    textClass: "text-amber-700 dark:text-amber-300",
  },
  "FAIR PERFORMANCE": {
    badgeClass: "badge-interpretation-fair",
    textClass: "text-orange-700 dark:text-orange-300",
  },
  "NEEDS IMPROVEMENT": {
    badgeClass: "badge-interpretation-needs-improvement",
    textClass: "text-red-700 dark:text-red-300",
  },
} as const;

function normalizeFacultyReportInterpretation(interpretation: string | null | undefined) {
  return interpretation?.trim().toUpperCase() ?? "";
}

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

export function formatFacultyReportCourseLabel(code?: string | null, title?: string | null) {
  const normalizedTitle = title?.trim() ?? "";
  const normalizedCode = code?.trim() ?? "";

  if (normalizedTitle) {
    return normalizedTitle;
  }

  if (normalizedCode) {
    return normalizedCode;
  }

  return "Unnamed course";
}

export function hasFacultyReportAnalyticsData(
  report: FacultyReportResponseDto,
  commentsCount: number
) {
  const hasInterpretation =
    normalizeFacultyReportInterpretation(report.overallInterpretation).length > 0;

  return (
    report.submissionCount > 0 ||
    report.sections.length > 0 ||
    commentsCount > 0 ||
    report.overallRating !== null ||
    hasInterpretation
  );
}

export function getFacultyReportInterpretationBadgeClass(
  interpretation: string | null | undefined
) {
  const normalizedInterpretation = normalizeFacultyReportInterpretation(interpretation);

  return (
    FACULTY_REPORT_INTERPRETATION_STYLE_MAP[
      normalizedInterpretation as keyof typeof FACULTY_REPORT_INTERPRETATION_STYLE_MAP
    ]?.badgeClass ?? "badge-interpretation-default"
  );
}

export function getFacultyReportInterpretationTextClass(interpretation: string | null | undefined) {
  const normalizedInterpretation = normalizeFacultyReportInterpretation(interpretation);

  return (
    FACULTY_REPORT_INTERPRETATION_STYLE_MAP[
      normalizedInterpretation as keyof typeof FACULTY_REPORT_INTERPRETATION_STYLE_MAP
    ]?.textClass ?? "text-foreground"
  );
}
