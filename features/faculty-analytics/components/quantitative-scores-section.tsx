"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { FacultyReportSectionPerformanceChart } from "@/features/faculty-analytics/components/faculty-report-section-performance-chart";
import { FacultyReportSections } from "@/features/faculty-analytics/components/faculty-report-sections";
import { cn } from "@/lib/utils";
import type { FacultyReportSectionDto } from "@/features/faculty-analytics/types";

type QuantitativeScoresSectionProps = {
  sections: FacultyReportSectionDto[];
  submissionCount: number;
  defaultOpen?: boolean;
};

export function QuantitativeScoresSection({
  sections,
  submissionCount,
  defaultOpen = false,
}: QuantitativeScoresSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (sections.length === 0) return null;

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
          <div className="space-y-6 border-t border-border/70 px-6 py-6">
            <FacultyReportSectionPerformanceChart sections={sections} />
            <FacultyReportSections sections={sections} />
          </div>
        </div>
      </div>
    </section>
  );
}
