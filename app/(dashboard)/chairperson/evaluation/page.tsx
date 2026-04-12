import { FacultyEvaluationListScreen } from "@/features/faculty-evaluation";

export default function ChairpersonEvaluationPage() {
  return (
    <FacultyEvaluationListScreen role={{ roleLabel: "Chairperson", rolePath: "/chairperson" }} />
  );
}
