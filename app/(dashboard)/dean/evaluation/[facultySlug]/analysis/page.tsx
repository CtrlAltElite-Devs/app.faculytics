import { redirect } from "next/navigation";

type FacultyAnalysisDetailPageProps = {
  params: Promise<{
    facultySlug: string;
  }>;
};

export default async function DeanEvaluationAnalysisDetailPage({
  params,
}: FacultyAnalysisDetailPageProps) {
  const { facultySlug } = await params;
  redirect(`/dean/${facultySlug}/analysis`);
}
