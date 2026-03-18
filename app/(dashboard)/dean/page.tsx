import { DeanDashboardHeader } from "./_components/dean-dashboard-header";
import { DeanMetricsGrid } from "./_components/dean-metrics-grid";
import { DeanOverallSentimentPieChart, DeanSentimentBarChart } from "./_components/dean-charts";

export default function DeanDashboardPage() {
  return (
    <section className="space-y-6 md:p-8">
      <DeanDashboardHeader />
      <DeanMetricsGrid />

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <DeanSentimentBarChart />
        <DeanOverallSentimentPieChart />
      </div>
    </section>
  );
}
