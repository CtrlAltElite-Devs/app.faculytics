import { FacultyReportScreen } from "./_components/faculty-report-screen";

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
