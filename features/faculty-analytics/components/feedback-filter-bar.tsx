"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SENTIMENT_FILTER_CHIP_CLASS,
  SENTIMENT_LABEL,
} from "@/features/faculty-analytics/lib/sentiment-colors";
import { cn } from "@/lib/utils";
import type { QualitativeThemeDto, SentimentLabel } from "@/features/faculty-analytics/types";

type FeedbackFilterBarProps = {
  themes: QualitativeThemeDto[];
  sentimentFilter: SentimentLabel | null;
  resolvedThemeId: string | null;
  onSentimentChange: (next: SentimentLabel | null) => void;
  onThemeChange: (label: string | null) => void;
  disabled?: boolean;
  disabledReason?: string;
};

const SENTIMENT_OPTIONS: SentimentLabel[] = ["positive", "neutral", "negative"];

export function FeedbackFilterBar({
  themes,
  sentimentFilter,
  resolvedThemeId,
  onSentimentChange,
  onThemeChange,
  disabled = false,
  disabledReason,
}: FeedbackFilterBarProps) {
  const hasActiveFilters = sentimentFilter !== null || resolvedThemeId !== null;
  const selectedTheme = themes.find((t) => t.themeId === resolvedThemeId) ?? null;

  const handleSentimentClick = (next: SentimentLabel) => {
    if (disabled) return;
    onSentimentChange(sentimentFilter === next ? null : next);
  };

  const handleThemeChange = (themeId: string) => {
    if (disabled) return;
    if (themeId === "ALL") {
      onThemeChange(null);
      return;
    }
    const match = themes.find((t) => t.themeId === themeId);
    onThemeChange(match?.label ?? null);
  };

  const handleClearAll = () => {
    if (disabled) return;
    onSentimentChange(null);
    onThemeChange(null);
  };

  return (
    <div className={cn("space-y-2", disabled && "opacity-60")}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Sentiment
        </span>
        {SENTIMENT_OPTIONS.map((value) => {
          const isActive = sentimentFilter === value;
          return (
            <button
              key={value}
              type="button"
              data-active={isActive}
              disabled={disabled}
              onClick={() => handleSentimentClick(value)}
              className={cn(
                "rounded-full border border-border bg-background px-3 py-1 font-sans text-xs transition-colors",
                "hover:bg-muted disabled:cursor-not-allowed disabled:hover:bg-background",
                SENTIMENT_FILTER_CHIP_CLASS[value]
              )}
            >
              {SENTIMENT_LABEL[value]}
            </button>
          );
        })}

        <span className="ml-2 font-sans text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Topic
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-w-44 justify-between font-sans text-xs"
              disabled={disabled || themes.length === 0}
            >
              <span className="truncate">{selectedTheme ? selectedTheme.label : "All topics"}</span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-72 w-64 overflow-auto">
            <DropdownMenuRadioGroup
              value={resolvedThemeId ?? "ALL"}
              onValueChange={handleThemeChange}
            >
              <DropdownMenuRadioItem value="ALL" className="font-sans text-sm">
                All topics
              </DropdownMenuRadioItem>
              {themes.map((theme) => (
                <DropdownMenuRadioItem
                  key={theme.themeId}
                  value={theme.themeId}
                  className="font-sans text-sm"
                >
                  {theme.label}
                  <span className="ml-2 text-[10px] tabular-nums text-muted-foreground">
                    · {theme.count}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto font-sans text-xs"
            onClick={handleClearAll}
            disabled={disabled}
          >
            Clear filters
          </Button>
        ) : null}
      </div>

      {disabled && disabledReason ? (
        <p
          role="status"
          className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 font-sans text-xs text-muted-foreground"
        >
          {disabledReason}
        </p>
      ) : null}
    </div>
  );
}
