import { FacultyReportScreen } from "@/features/faculty-analytics";

type FacultyAnalysisDetailPageProps = {
  params: Promise<{
    facultyId: string;
  }>;
};

export default async function FacultyAnalysisDetailPage({
  params,
}: FacultyAnalysisDetailPageProps) {
  const { facultyId } = await params;

  return <FacultyReportScreen facultyId={facultyId} />;
}
