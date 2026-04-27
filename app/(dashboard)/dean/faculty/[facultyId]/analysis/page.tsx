import { notFound } from "next/navigation";

import { FacultyReportScreen } from "@/features/faculty-analytics";
import { isHiddenFaculty } from "@/features/faculty-analytics/lib/hidden-faculty";

type FacultyAnalysisDetailPageProps = {
  params: Promise<{
    facultyId: string;
  }>;
};

export default async function FacultyAnalysisDetailPage({
  params,
}: FacultyAnalysisDetailPageProps) {
  const { facultyId } = await params;

  if (isHiddenFaculty(facultyId)) {
    notFound();
  }

  return <FacultyReportScreen facultyId={facultyId} />;
}
