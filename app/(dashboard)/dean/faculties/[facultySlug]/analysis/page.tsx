import { notFound } from "next/navigation";

import { FacultyAnalysisScreen } from "./_components/faculty-analysis-screen";

import { getDeanFacultyAnalysisDetailViewModel } from "@/features/faculty-analytics";

type FacultyAnalysisDetailPageProps = {
  params: Promise<{
    facultySlug: string;
  }>;
};

export default async function FacultyAnalysisDetailPage({
  params,
}: FacultyAnalysisDetailPageProps) {
  const { facultySlug } = await params;
  const viewModel = getDeanFacultyAnalysisDetailViewModel(facultySlug);

  if (!viewModel) {
    notFound();
  }

  return <FacultyAnalysisScreen faculty={viewModel.faculty} />;
}
