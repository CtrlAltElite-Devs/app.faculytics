import { FacultyEvaluationDetailScreen } from "@/features/faculty-evaluation";

type DeanEvaluationDetailPageProps = {
  params: Promise<{
    facultyId: string;
  }>;
};

export default async function DeanEvaluationDetailPage({ params }: DeanEvaluationDetailPageProps) {
  const { facultyId } = await params;

  return (
    <FacultyEvaluationDetailScreen
      role={{ roleLabel: "Dean", rolePath: "/dean" }}
      facultyId={facultyId}
    />
  );
}
