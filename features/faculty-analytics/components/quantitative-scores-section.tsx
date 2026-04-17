"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { FacultyReportDimensionRadarChart } from "@/features/faculty-analytics/components/faculty-report-dimension-radar-chart";
import { FacultyReportImpactScatterChart } from "@/features/faculty-analytics/components/faculty-report-impact-scatter-chart";
import { FacultyReportRatingDistributionChart } from "@/features/faculty-analytics/components/faculty-report-rating-distribution-chart";
import { FacultyReportSectionPerformanceChart } from "@/features/faculty-analytics/components/faculty-report-section-performance-chart";
import { FacultyReportSections } from "@/features/faculty-analytics/components/faculty-report-sections";
import { cn } from "@/lib/utils";
import type {
  FacultyReportDimensionDto,
  FacultyReportSectionDto,
} from "@/features/faculty-analytics/types";

type QuantitativeScoresSectionProps = {
  sections: FacultyReportSectionDto[];
  dimensions: FacultyReportDimensionDto[];
  submissionCount: number;
  defaultOpen?: boolean;
  /**
   * When false, render chart + sections directly without the disclosure
   * chrome. Used inside the Scores tab where the panel is already
   * tab-scoped and collapse adds no value.
   */
  collapsible?: boolean;
};

function ChartsStack({
  sections,
  dimensions,
}: {
  sections: FacultyReportSectionDto[];
  dimensions: FacultyReportDimensionDto[];
}) {
  const hasRadar = dimensions.length >= 3;

  return (
    <div className="space-y-6">
      <FacultyReportSectionPerformanceChart sections={sections} />
      <div
        className={cn(
          "grid gap-6",
          hasRadar ? "lg:grid-cols-2" : "grid-cols-1",
        )}
      >
        {hasRadar ? (
          <FacultyReportDimensionRadarChart dimensions={dimensions} />
        ) : null}
        <FacultyReportImpactScatterChart sections={sections} />
      </div>
      <FacultyReportRatingDistributionChart sections={sections} />
      <FacultyReportSections sections={sections} />
    </div>
  );
}

export function QuantitativeScoresSection({
  sections,
  dimensions,
  submissionCount,
  defaultOpen = false,
  collapsible = true,
}: QuantitativeScoresSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (sections.length === 0) return null;

  if (!collapsible) {
    return (
      <section className="rounded-2xl border border-border/70 bg-card">
        <div className="px-6 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Numerical scores
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            Per-section performance
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Weighted averages across {sections.length} section
            {sections.length === 1 ? "" : "s"} from {submissionCount} submission
            {submissionCount === 1 ? "" : "s"}.
          </p>
        </div>
        <div className="border-t border-border/70 px-6 py-6">
          <ChartsStack sections={sections} dimensions={dimensions} />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border/70 bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Numerical scores
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            Per-section performance
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Weighted averages across {sections.length} section
            {sections.length === 1 ? "" : "s"} from {submissionCount} submission
            {submissionCount === 1 ? "" : "s"}.
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      <div
        data-state={open ? "open" : "closed"}
        aria-hidden={!open}
        className="grid transition-[grid-template-rows] duration-300 ease-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]"
      >
        <div className="overflow-hidden">
          <div className="border-t border-border/70 px-6 py-6">
            <ChartsStack sections={sections} dimensions={dimensions} />
          </div>
        </div>
      </div>
    </section>
  );
}
