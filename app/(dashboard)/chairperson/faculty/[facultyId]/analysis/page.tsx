import { FacultyReportScreen } from "@/features/faculty-analytics";

type ChairpersonFacultyAnalysisPageProps = {
  params: Promise<{
    facultyId: string;
  }>;
};

export default async function ChairpersonFacultyAnalysisPage({
  params,
}: ChairpersonFacultyAnalysisPageProps) {
  const { facultyId } = await params;

  return <FacultyReportScreen facultyId={facultyId} />;
}
