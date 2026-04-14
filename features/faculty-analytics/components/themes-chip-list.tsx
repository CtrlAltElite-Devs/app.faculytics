"use client";

import { Badge } from "@/components/ui/badge";
import type { RankedTheme } from "@/features/faculty-analytics/lib/pipeline-themes";

type ThemesChipListProps = {
  themes: RankedTheme[];
  maxVisible?: number;
  className?: string;
};

export function ThemesChipList({ themes, maxVisible = 8, className }: ThemesChipListProps) {
  if (themes.length === 0) return null;

  const visible = themes.slice(0, maxVisible);
  const overflow = themes.length - visible.length;

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {visible.map((theme) => (
          <Badge
            key={theme.topicLabel}
            variant="secondary"
            className="gap-1.5 py-1"
            title={theme.sampleQuotes.join("\n")}
          >
            <span className="font-medium">{theme.topicLabel}</span>
            <span className="text-muted-foreground text-[0.7rem]">{theme.commentCount}</span>
          </Badge>
        ))}
        {overflow > 0 ? (
          <Badge variant="outline" className="text-muted-foreground">
            +{overflow} more
          </Badge>
        ) : null}
      </div>
    </div>
  );
}
