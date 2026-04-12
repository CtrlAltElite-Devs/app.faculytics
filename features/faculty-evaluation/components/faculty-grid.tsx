import { FacultyCard } from "@/features/faculty-evaluation/components/faculty-card";
import type {
  FacultyEvaluationListItem,
  FacultyEvaluationRoleContext,
} from "@/features/faculty-evaluation/types";
import type { QuestionnaireTypeSummary } from "@/features/questionnaires/types";

type FacultyGridProps = {
  facultyRows: FacultyEvaluationListItem[];
  role: FacultyEvaluationRoleContext;
  semesterId: string;
  semesterLabel: string;
  questionnaireTypes: QuestionnaireTypeSummary[];
  typesLoading?: boolean;
};

export function FacultyGrid({
  facultyRows,
  role,
  semesterId,
  semesterLabel,
  questionnaireTypes,
  typesLoading = false,
}: FacultyGridProps) {
  return (
    <>
      {facultyRows.map((faculty) => (
        <FacultyCard
          key={faculty.id}
          faculty={faculty}
          role={role}
          semesterId={semesterId}
          semesterLabel={semesterLabel}
          questionnaireTypes={questionnaireTypes}
          typesLoading={typesLoading}
        />
      ))}
    </>
  );
}
