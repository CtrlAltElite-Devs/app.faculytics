import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FacultyAnalysisRadarChart } from "./_components/faculty-analysis-radar-chart";
import { FacultyAnalysisSummary } from "./_components/faculty-analysis-summary";
import { FacultyAnalysisToolbar } from "./_components/faculty-analysis-toolbar";

import { getDeanFacultyAnalysisBySlug } from "@/app/(dashboard)/dean/_data/analytics-sample-data";
import { Button } from "@/components/ui/button";

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

  return (
    <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Button asChild variant="outline" size="sm" className="font-sans">
          <Link href="/dean">
            <ArrowLeft className="size-4" />
            Back to Faculty Analysis
          </Link>
        </Button>
        <FacultyAnalysisToolbar />
      </div>

      <FacultyAnalysisSummary faculty={faculty} />
      <FacultyAnalysisRadarChart faculty={faculty} />
    </section>
  );
}
