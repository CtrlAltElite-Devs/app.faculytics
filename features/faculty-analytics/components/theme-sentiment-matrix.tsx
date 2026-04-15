"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { themeRowAnchorId } from "@/features/faculty-analytics/lib/theme-anchor";
import type { QualitativeThemeDto, SentimentLabel } from "@/features/faculty-analytics/types";

type ThemeSentimentMatrixProps = {
  themes: QualitativeThemeDto[];
  activeSentiment: SentimentLabel | null;
  activeThemeLabel: string | null;
  onCellClick: (themeLabel: string, sentiment: SentimentLabel | null) => void;
  onRowLabelClick?: (themeLabel: string) => void;
};

const SENTIMENT_COLORS: Record<SentimentLabel, string> = {
  negative: "bg-rose-500",
  neutral: "bg-muted-foreground/40",
  positive: "bg-emerald-500",
};

const CELL_HEADERS: { key: SentimentLabel; label: string }[] = [
  { key: "negative", label: "Negative" },
  { key: "neutral", label: "Neutral" },
  { key: "positive", label: "Positive" },
];

function dominantKey(theme: QualitativeThemeDto): SentimentLabel {
  const { positive, neutral, negative } = theme.sentimentSplit;
  if (negative >= positive && negative >= neutral) return "negative";
  if (positive >= neutral) return "positive";
  return "neutral";
}

export function ThemeSentimentMatrix({
  themes,
  activeSentiment,
  activeThemeLabel,
  onCellClick,
  onRowLabelClick,
}: ThemeSentimentMatrixProps) {
  if (themes.length === 0) {
    return (
      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="font-playfair text-xl">Themes × Sentiment</CardTitle>
          <CardDescription>No themes detected in this analysis.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const maxCellCount = themes.reduce((max, theme) => {
    const cellMax = Math.max(
      theme.sentimentSplit.positive,
      theme.sentimentSplit.neutral,
      theme.sentimentSplit.negative
    );
    return Math.max(max, cellMax);
  }, 0);

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Themes × Sentiment</CardTitle>
        <CardDescription>
          Click a cell to filter comments by theme and sentiment together.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full border-collapse font-sans text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Theme</th>
              {CELL_HEADERS.map((h) => (
                <th key={h.key} className="w-[18%] px-3 py-2 text-center font-medium">
                  {h.label}
                </th>
              ))}
              <th className="w-[10%] px-3 py-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {themes.map((theme) => {
              const dominant = dominantKey(theme);
              const isActiveRow = activeThemeLabel === theme.label;
              return (
                <tr
                  key={theme.themeId}
                  id={themeRowAnchorId(theme.label)}
                  data-theme-label={theme.label}
                  className={cn(
                    "border-b border-border/40 transition-colors",
                    isActiveRow ? "bg-muted/30" : "hover:bg-muted/20",
                    "data-[highlight=pulse]:animate-pulse data-[highlight=pulse]:bg-amber-100/60"
                  )}
                >
                  <td className="py-2 pr-3 align-middle">
                    <button
                      type="button"
                      onClick={() => onRowLabelClick?.(theme.label)}
                      className={cn(
                        "font-medium text-foreground hover:underline",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                      )}
                      aria-label={`Jump to recommendation for ${theme.label}`}
                    >
                      {theme.label}
                    </button>
                  </td>
                  {CELL_HEADERS.map(({ key, label: cellLabel }) => {
                    const count = theme.sentimentSplit[key];
                    const isActiveCell =
                      activeThemeLabel === theme.label && activeSentiment === key;
                    const width = maxCellCount > 0 ? (count / maxCellCount) * 100 : 0;
                    return (
                      <td
                        key={key}
                        className={cn(
                          "px-2 py-2 align-middle",
                          dominant === key ? "bg-muted/10" : ""
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => onCellClick(theme.label, isActiveCell ? null : key)}
                          className={cn(
                            "flex w-full flex-col items-center gap-1 rounded-md px-2 py-1 text-center transition-colors",
                            "hover:bg-muted/40",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isActiveCell ? "ring-2 ring-primary/70 bg-muted/40" : ""
                          )}
                          aria-label={`Filter comments to ${theme.label} theme, ${cellLabel} sentiment, ${count} submissions`}
                          aria-pressed={isActiveCell}
                        >
                          <span className="tabular-nums font-medium text-foreground">{count}</span>
                          <span
                            aria-hidden="true"
                            className={cn(
                              "h-1.5 w-full rounded-full",
                              count > 0 ? SENTIMENT_COLORS[key] : "bg-muted"
                            )}
                            style={{ width: count > 0 ? `${Math.max(10, width)}%` : "100%" }}
                          />
                        </button>
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                    {theme.count}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
