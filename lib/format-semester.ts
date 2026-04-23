export type SemesterLike = {
  label?: string | null;
  academicYear?: string | null;
  code?: string | null;
};

export const SEMESTER_UNKNOWN_LABEL = "Unknown Semester";
const ACADEMIC_YEAR_UNKNOWN_SUFFIX = "(year unknown)";

export function formatSemesterDisplay(semester: SemesterLike): string {
  const head = semester.label?.trim() || semester.code?.trim() || SEMESTER_UNKNOWN_LABEL;
  const year = semester.academicYear?.trim();
  return year ? `${head} • ${year}` : `${head} ${ACADEMIC_YEAR_UNKNOWN_SUFFIX}`;
}
