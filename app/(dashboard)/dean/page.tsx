import { deanAnalyticsMock } from "@/mocks/dean-analytics";

export default function DeanDashboardPage() {
  return (
    <section className="space-y-6 p-4 md:p-8">
      <div className="space-y-2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
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

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Sentiment snapshot</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Visual placeholder for aggregate dean-level sentiment across all faculties.
              </p>
            </div>
            <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600">
              Overall positive
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {deanAnalyticsMock.sentimentBands.map((band) => (
              <div key={band.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{band.label}</span>
                  <span className="text-muted-foreground">{band.value}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-brand-blue"
                    style={{ width: band.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight">Department highlights</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Key talking points for dean review meetings and weekly reporting.
          </p>

          <div className="mt-6 space-y-4">
            {deanAnalyticsMock.departmentHighlights.map((item) => (
              <div key={item.label} className="rounded-xl border bg-background/60 p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-base font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
