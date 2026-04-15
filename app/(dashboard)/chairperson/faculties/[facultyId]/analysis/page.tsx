import Link from "next/link";

import { Button } from "@/components/ui/button";

type ChairpersonFacultyAnalysisPlaceholderPageProps = {
  params: Promise<{
    facultyId: string;
  }>;
  searchParams: Promise<{
    facultyName?: string;
    semesterLabel?: string;
  }>;
};

export default async function ChairpersonFacultyAnalysisPlaceholderPage({
  params,
  searchParams,
}: ChairpersonFacultyAnalysisPlaceholderPageProps) {
  const { facultyId } = await params;
  const { facultyName, semesterLabel } = await searchParams;

  return (
    <section className="space-y-6 px-1 pb-4 md:p-8">
      <div className="space-y-2">
        <h1 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
          Faculty Analysis
        </h1>
        <p className="font-sans text-sm text-muted-foreground">
          This chairperson faculty analysis page is a placeholder for now.
        </p>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <dl className="space-y-3 font-sans text-sm">
          <div>
            <dt className="text-muted-foreground">Faculty</dt>
            <dd className="font-medium text-foreground">{facultyName ?? "Unknown faculty"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Faculty ID</dt>
            <dd className="font-medium text-foreground">{facultyId}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Semester</dt>
            <dd className="font-medium text-foreground">{semesterLabel ?? "Not provided"}</dd>
          </div>
        </dl>
      </div>

      <Button asChild variant="outline">
        <Link href="/chairperson/faculties">Back to Faculties</Link>
      </Button>
    </section>
  );
}
