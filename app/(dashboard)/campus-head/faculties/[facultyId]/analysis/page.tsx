import { FacultyReportScreen } from "@/features/faculty-analytics";

type CampusHeadFacultyAnalysisPageProps = {
  params: Promise<{
    facultyId: string;
  }>;
};

export default async function CampusHeadFacultyAnalysisPage({
  params,
}: CampusHeadFacultyAnalysisPageProps) {
  const { facultyId } = await params;

  return <FacultyReportScreen facultyId={facultyId} />;
}
