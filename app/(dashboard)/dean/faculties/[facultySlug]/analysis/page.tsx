import { notFound } from "next/navigation";

import { FacultyAnalysisScreen } from "./_components/faculty-analysis-screen";

import { getDeanFacultyAnalysisBySlug } from "@/app/(dashboard)/dean/_data/analytics-sample-data";

type FacultyAnalysisDetailPageProps = {
  params: Promise<{
    facultySlug: string;
  }>;
};

export default async function FacultyAnalysisDetailPage({
  params,
}: FacultyAnalysisDetailPageProps) {
  const { facultySlug } = await params;
  const faculty = getDeanFacultyAnalysisBySlug(facultySlug);

  if (!faculty) {
    notFound();
  }

  return <FacultyAnalysisScreen faculty={faculty} />;
}
