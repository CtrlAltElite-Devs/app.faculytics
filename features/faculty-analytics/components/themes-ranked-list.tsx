"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { QualitativeThemeDto } from "@/features/faculty-analytics/types";

type ThemesRankedListProps = {
  themes: QualitativeThemeDto[];
  maxVisible?: number;
};

export function ThemesRankedList({ themes, maxVisible = 10 }: ThemesRankedListProps) {
  if (themes.length === 0) return null;

  const visible = themes.slice(0, maxVisible);

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="font-playfair text-xl">Top Themes</CardTitle>
        <CardDescription>Ranked by comment volume with sentiment breakdown.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {visible.map((theme) => {
            const { positive, neutral, negative } = theme.sentimentSplit;
            const pos = theme.count > 0 ? (positive / theme.count) * 100 : 0;
            const neu = theme.count > 0 ? (neutral / theme.count) * 100 : 0;
            const neg = theme.count > 0 ? (negative / theme.count) * 100 : 0;
            return (
              <li key={theme.themeId} className="space-y-1.5">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-sans text-sm font-medium text-foreground">
                    {theme.label}
                  </span>
                  <span className="font-sans text-xs text-muted-foreground">
                    {theme.count} mention{theme.count === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                  <span
                    className="h-full bg-emerald-500"
                    style={{ width: `${pos}%` }}
                    aria-label={`positive ${pos.toFixed(0)}%`}
                  />
                  <span
                    className="h-full bg-muted-foreground/40"
                    style={{ width: `${neu}%` }}
                    aria-label={`neutral ${neu.toFixed(0)}%`}
                  />
                  <span
                    className="h-full bg-rose-500"
                    style={{ width: `${neg}%` }}
                    aria-label={`negative ${neg.toFixed(0)}%`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
