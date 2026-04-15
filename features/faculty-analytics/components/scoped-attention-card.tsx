"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, TrendingDown, Waves } from "lucide-react";

import type { AttentionFlagDto, AttentionItemDto } from "@/features/faculty-analytics/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ScopedAttentionCardProps = {
  items: AttentionItemDto[];
  isLoading?: boolean;
  hasAnalyticsData: boolean;
  scopeLabel: "Campus" | "Department" | "Program";
  facultiesHref: string;
};

function getAttentionScopeCopy(scopeLabel: ScopedAttentionCardProps["scopeLabel"]) {
  switch (scopeLabel) {
    case "Campus":
      return "Faculty in your campus flagged for review in the selected semester.";
    case "Program":
      return "Faculty in your assigned program scope flagged for review in the selected semester.";
    case "Department":
    default:
      return "Faculty in your department flagged for review in the selected semester.";
  }
}

const FLAG_STYLES: Record<
  AttentionFlagDto["type"],
  {
    label: string;
    icon: typeof TrendingDown;
    className: string;
  }
> = {
  declining_trend: {
    label: "Declining Trend",
    icon: TrendingDown,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  },
  quant_qual_gap: {
    label: "Quant-Qual Gap",
    icon: Waves,
    className: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  },
  low_coverage: {
    label: "Low Coverage",
    icon: AlertTriangle,
    className: "border-rose-500/30 bg-rose-500/10 text-rose-200",
  },
};

function getPrimaryFlag(flags: AttentionFlagDto[]) {
  return flags[0] ?? null;
}

function formatPrimaryDescription(flag: AttentionFlagDto | null) {
  if (!flag) {
    return "This faculty member has been flagged for review.";
  }

  switch (flag.type) {
    case "declining_trend":
      return "Recent score or sentiment trend is moving downward.";
    case "quant_qual_gap":
      return "Quantitative score and qualitative sentiment are notably misaligned.";
    case "low_coverage":
      return "A large share of submissions has not yet produced analytics coverage.";
    default:
      return flag.description;
  }
}

function AttentionCardEmptyState({ hasAnalyticsData }: { hasAnalyticsData: boolean }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-6 text-center">
      <p className="max-w-sm font-sans text-sm text-muted-foreground">
        {hasAnalyticsData
          ? "No faculty are currently flagged for attention in this semester."
          : "Attention indicators will appear here after analytics refresh completes."}
      </p>
    </div>
  );
}

export function ScopedAttentionCard({
  items,
  isLoading = false,
  hasAnalyticsData,
  scopeLabel,
  facultiesHref,
}: ScopedAttentionCardProps) {
  const topItems = items.slice(0, 5);

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="gap-2">
        <CardTitle className="font-playfair text-xl font-semibold sm:text-2xl">
          Faculty Requiring Attention
        </CardTitle>
        <p className="font-sans text-sm text-muted-foreground">
          {getAttentionScopeCopy(scopeLabel)}
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && items.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-xl border border-border/60 bg-muted/30"
              />
            ))}
          </div>
        ) : topItems.length === 0 ? (
          <AttentionCardEmptyState hasAnalyticsData={hasAnalyticsData} />
        ) : (
          <div className="space-y-3">
            {topItems.map((item) => {
              const primaryFlag = getPrimaryFlag(item.flags);

              return (
                <div
                  key={`${item.facultyId}-${item.departmentCode}`}
                  className="rounded-xl border border-border/70 bg-background/60 p-4"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-sans text-sm font-semibold text-foreground">
                          {item.facultyName}
                        </p>
                        <p className="mt-1 font-sans text-xs text-muted-foreground">
                          Department {item.departmentCode}
                        </p>
                      </div>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-auto px-0 py-0 font-sans text-brand-blue hover:text-brand-blue"
                      >
                        <Link href={facultiesHref}>
                          View List
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.flags.map((flag) => {
                        const config = FLAG_STYLES[flag.type];
                        const Icon = config.icon;

                        return (
                          <Badge
                            key={`${item.facultyId}-${flag.type}-${flag.description}`}
                            variant="outline"
                            className={cn("gap-1.5 border font-sans text-[11px]", config.className)}
                          >
                            <Icon className="size-3" />
                            {config.label}
                          </Badge>
                        );
                      })}
                    </div>

                    <p className="font-sans text-sm text-muted-foreground">
                      {formatPrimaryDescription(primaryFlag)}
                    </p>
                  </div>
                </div>
              );
            })}

            {items.length > 5 ? (
              <div className="flex justify-end pt-1">
                <Button asChild variant="outline" size="sm" className="font-sans">
                  <Link href={facultiesHref}>View all flagged faculty</Link>
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
