"use client";

import { cn } from "@/lib/utils";

type FacultyAnalysisSparkProps = {
  data: number[] | null;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function FacultyAnalysisSpark({
  data,
  width = 110,
  height = 32,
  fill = true,
  className,
  ariaLabel,
}: FacultyAnalysisSparkProps) {
  if (!data || data.length < 2) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/30 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70",
          className
        )}
        style={{ width, height }}
        aria-label={ariaLabel ?? "Trend unavailable"}
        role="img"
      >
        — trend n/a
      </div>
    );
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = data.length > 1 ? width / (data.length - 1) : width;
  const points = data.map<[number, number]>((value, index) => [
    index * step,
    height - ((value - min) / range) * (height - 4) - 2,
  ]);

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");
  const fillPath = fill ? `${path} L${width.toFixed(1)},${height} L0,${height} Z` : "";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? "Trend sparkline"}
      className={cn("block text-brand-blue", className)}
    >
      {fill ? <path d={fillPath} fill="currentColor" opacity={0.12} /> : null}
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
