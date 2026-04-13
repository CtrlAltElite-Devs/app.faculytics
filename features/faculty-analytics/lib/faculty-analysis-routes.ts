import { DEFAULT_QUESTIONNAIRE_TYPE } from "@/features/questionnaires/constants";

type BuildDeanFacultyAnalysisHrefOptions = {
  facultyId: string;
  facultyName: string;
  semesterId: string;
  semesterLabel: string;
  questionnaireTypeCode?: string;
};

export function buildDeanFacultyAnalysisHref({
  facultyId,
  facultyName,
  semesterId,
  semesterLabel,
  questionnaireTypeCode = DEFAULT_QUESTIONNAIRE_TYPE,
}: BuildDeanFacultyAnalysisHrefOptions) {
  const params = new URLSearchParams({
    facultyName,
    semesterId,
    semesterLabel,
    questionnaireTypeCode,
  });

  return `/dean/faculties/${facultyId}/analysis?${params.toString()}`;
}
