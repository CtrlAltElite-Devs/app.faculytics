import { DeanFacultyCard } from "@/components/faculytics/dean-faculty-card";
import { DeanSentimentCharts } from "@/components/faculytics/dean-sentiment-charts";
import { deanAnalyticsMock } from "@/mocks/dean-analytics";

export default function DeanDashboardPage() {
  return (
    <section className="space-y-6 p-4 md:p-8">
      <div className="space-y-2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <h1 className="font-playfair text-3xl font-semibold tracking-tight">
              Department Performance Overview
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
              A high-level dashboard for monitoring faculty participation, response volume,
              overall sentiment, and department course load.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex w-full flex-col lg:w-56">
              <select
                id="academic-year"
                name="academic-year"
                defaultValue="2026 - 2027"
                className="h-11 rounded-xl border bg-card px-4 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
              >
                <option value="2026 - 2027">2026 - 2027</option>
              </select>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated:{" "}
              <span className="font-medium text-foreground">{deanAnalyticsMock.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {deanAnalyticsMock.statCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border bg-card p-6 shadow-sm transition-colors hover:bg-accent/40"
          >
            <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight">{card.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{card.hint}</p>
          </div>
        ))}
      </div>

      <DeanSentimentCharts
        barChartData={deanAnalyticsMock.sentimentBarChartData}
        pieChartData={deanAnalyticsMock.sentimentPieChartData}
      />

      <section className="space-y-5">
        <div className="space-y-2">
          <h2 className="font-playfair text-2xl font-semibold tracking-tight">Faculty Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Review faculty-specific subject coverage and jump directly to individual analysis.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {deanAnalyticsMock.facultyCards.map((faculty) => (
            <DeanFacultyCard
              key={faculty.name}
              name={faculty.name}
              imageSrc={faculty.imageSrc}
              subjects={faculty.subjects}
              analysisHref={faculty.analysisHref}
            />
          ))}
        </div>
      </section>
    </section>
  );
}
