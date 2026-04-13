import type { FacultyEvaluationRoleContext } from "@/features/faculty-evaluation/types";

type BuildFacultyEvaluationHrefOptions = {
  role: FacultyEvaluationRoleContext;
  facultyId: string;
  facultyName: string;
  semesterId: string;
  semesterLabel: string;
  typeId: string;
};

export function buildFacultyEvaluationHref({
  role,
  facultyId,
  facultyName,
  semesterId,
  semesterLabel,
  typeId,
}: BuildFacultyEvaluationHrefOptions) {
  const params = new URLSearchParams({
    facultyName,
    semesterId,
    semesterLabel,
    typeId,
  });

  return `${role.rolePath}/evaluation/${facultyId}?${params.toString()}`;
}
