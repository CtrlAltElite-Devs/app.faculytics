import { FacultyEvaluationDetailScreen } from "@/features/faculty-evaluation";

type ChairpersonEvaluationDetailPageProps = {
  params: Promise<{
    facultyId: string;
  }>;
};

export default async function ChairpersonEvaluationDetailPage({
  params,
}: ChairpersonEvaluationDetailPageProps) {
  const { facultyId } = await params;

  return (
    <FacultyEvaluationDetailScreen
      role={{ roleLabel: "Chairperson", rolePath: "/chairperson" }}
      facultyId={facultyId}
    />
  );
}
