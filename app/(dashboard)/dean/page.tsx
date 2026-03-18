import { DeanDashboardHeader } from "./_components/dean-dashboard-header";
import { DeanFacultyAnalysisTable } from "./_components/dean-faculty-analysis-table";
import { DeanMetricsGrid } from "./_components/dean-metrics-grid";
import { DeanOverallSentimentPieChart, DeanSentimentBarChart } from "./_components/dean-charts";

export default function DeanDashboardPage() {
  return (
    <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
      <DeanDashboardHeader />
      <DeanMetricsGrid />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <DeanSentimentBarChart />
        <DeanOverallSentimentPieChart />
      </div>

      <DeanFacultyAnalysisTable />
    </section>
  );
}
