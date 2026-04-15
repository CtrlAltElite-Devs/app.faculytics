import { DEFAULT_QUESTIONNAIRE_TYPE } from "@/features/questionnaires/constants";

type BuildScopedFacultyAnalysisHrefOptions = {
  facultyId: string;
  facultyName: string;
  semesterId: string;
  semesterLabel: string;
  questionnaireTypeCode?: string;
  scopeLabel: "Campus" | "Department" | "Program";
};

export function buildScopedFacultyAnalysisHref({
  facultyId,
  facultyName,
  semesterId,
  semesterLabel,
  questionnaireTypeCode = DEFAULT_QUESTIONNAIRE_TYPE,
  scopeLabel,
}: BuildScopedFacultyAnalysisHrefOptions) {
  const params = new URLSearchParams({
    facultyName,
    semesterId,
    semesterLabel,
    questionnaireTypeCode,
  });

  const basePath =
    scopeLabel === "Campus"
      ? "/campus-head/faculties"
      : scopeLabel === "Program"
        ? "/chairperson/faculties"
        : "/dean/faculties";
  return `${basePath}/${facultyId}/analysis?${params.toString()}`;
}
