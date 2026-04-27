import { notFound } from "next/navigation";

import { FacultyReportScreen } from "@/features/faculty-analytics";
import { isHiddenFaculty } from "@/features/faculty-analytics/lib/hidden-faculty";

type CampusHeadFacultyAnalysisPageProps = {
  params: Promise<{
    facultyId: string;
  }>;
};

export default async function CampusHeadFacultyAnalysisPage({
  params,
}: CampusHeadFacultyAnalysisPageProps) {
  const { facultyId } = await params;

  if (isHiddenFaculty(facultyId)) {
    notFound();
  }

  return <FacultyReportScreen facultyId={facultyId} />;
}
