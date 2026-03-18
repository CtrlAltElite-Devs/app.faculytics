import { deanAnalyticsSampleData } from "@/app/(dashboard)/dean/_data/analytics-sample-data";

export function DeanDashboardHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="font-playfair text-3xl font-semibold tracking-tight">
          Department Performance Overview
        </h1>
        <p className="mt-5 max-w-3xl font-sans text-sm text-muted-foreground">
          A high-level dashboard for monitoring faculty participation and response volume of
          feedbacks.
        </p>
      </div>
      <div className="md:text-right">
        <select
          id="academic-year"
          defaultValue={deanAnalyticsSampleData.selectedAcademicYear}
          className="min-w-56 rounded-xl border border-input bg-background px-4 py-2.5 font-sans text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
        >
          {deanAnalyticsSampleData.academicYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          Last updated: {deanAnalyticsSampleData.lastUpdated}
        </p>
      </div>
    </div>
  );
}
