import { DeanDashboardHeader } from "@/features/dean/components/dean-dashboard-header";
import { DeanMetricsGrid } from "@/features/dean/components/dean-metrics-grid";
import {
  DeanOverallSentimentPieChart,
  DeanSentimentBarChart,
} from "@/features/dean/components/dean-charts";

export default function DeanDashboardPage() {
  return (
    <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
      <DeanDashboardHeader />
      <DeanMetricsGrid />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <DeanSentimentBarChart />
        <DeanOverallSentimentPieChart />
      </div>
    </section>
  );
}
