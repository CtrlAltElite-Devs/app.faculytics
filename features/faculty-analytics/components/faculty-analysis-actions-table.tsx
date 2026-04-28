"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { themeRowAnchorId } from "@/features/faculty-analytics/lib/theme-anchor";
import { cn } from "@/lib/utils";
import type {
  ActionPriority,
  RecommendedActionDto,
  TopicSource,
} from "@/features/faculty-analytics/types";

type FacultyAnalysisActionsTableProps = {
  actions: RecommendedActionDto[];
  onViewTheme?: (topicLabel: string) => void;
};

type ActionTab = "improvements" | "strengths";
type SortKey = "confidence" | "mentions";

const CONFIDENCE_RANK: Record<ActionPriority, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

const CONFIDENCE_VARIANT: Record<
  ActionPriority,
  "default" | "secondary" | "destructive" | "outline"
> = {
  HIGH: "destructive",
  MEDIUM: "secondary",
  LOW: "outline",
};

function extractTopic(action: RecommendedActionDto): TopicSource | null {
  return (
    action.supportingEvidence?.sources.find((s): s is TopicSource => s.type === "topic") ?? null
  );
}

function getMentions(action: RecommendedActionDto): number {
  const topic = extractTopic(action);
  if (topic) return topic.commentCount;
  return action.supportingEvidence?.basedOnSubmissions ?? 0;
}

function SegmentedTab({
  active,
  onChange,
  label,
  count,
  value,
}: {
  active: ActionTab;
  onChange: (next: ActionTab) => void;
  label: string;
  count: number;
  value: ActionTab;
}) {
  const isActive = active === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-sans text-xs font-medium transition-colors",
        isActive
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
      aria-pressed={isActive}
    >
      {label}
      <span className="font-mono text-[11px] text-muted-foreground">· {count}</span>
    </button>
  );
}

export function FacultyAnalysisActionsTable({
  actions,
  onViewTheme,
}: FacultyAnalysisActionsTableProps) {
  const [tab, setTab] = useState<ActionTab>("improvements");
  const [sortBy, setSortBy] = useState<SortKey>("confidence");

  const { improvements, strengths } = useMemo(() => {
    const improvements: RecommendedActionDto[] = [];
    const strengths: RecommendedActionDto[] = [];
    for (const action of actions) {
      if (action.category === "STRENGTH") strengths.push(action);
      else improvements.push(action);
    }
    return { improvements, strengths };
  }, [actions]);

  const visible = tab === "improvements" ? improvements : strengths;

  const sorted = useMemo(() => {
    const copy = [...visible];
    if (sortBy === "confidence") {
      copy.sort((a, b) => {
        const r = CONFIDENCE_RANK[a.priority] - CONFIDENCE_RANK[b.priority];
        if (r !== 0) return r;
        return getMentions(b) - getMentions(a);
      });
    } else {
      copy.sort((a, b) => getMentions(b) - getMentions(a));
    }
    return copy;
  }, [visible, sortBy]);

  if (actions.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-border/70 px-4 py-3">
        <div className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-muted/40 p-1">
          <SegmentedTab
            active={tab}
            onChange={setTab}
            label="Improvements"
            count={improvements.length}
            value="improvements"
          />
          <SegmentedTab
            active={tab}
            onChange={setTab}
            label="Strengths"
            count={strengths.length}
            value="strengths"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Sort
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="font-sans text-xs capitalize">
                {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortKey)}
              >
                <DropdownMenuRadioItem value="confidence">Confidence</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="mentions">Mentions</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="px-4 py-10 text-center font-sans text-sm text-muted-foreground">
          No {tab === "improvements" ? "improvement" : "strength"} actions identified.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Mentions
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Linked theme
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Confidence
                </th>
                <th scope="col" className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((action) => {
                const topic = extractTopic(action);
                const mentions = getMentions(action);
                return (
                  <tr key={action.id} className="border-t border-border/70 align-top">
                    <td className="max-w-[460px] px-4 py-4">
                      <div className="font-sans text-sm font-semibold text-foreground">
                        {action.headline}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {action.description}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-mono text-sm tabular-nums text-foreground">
                      {mentions}
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground">
                      {topic ? topic.topicLabel : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={CONFIDENCE_VARIANT[action.priority]}>{action.priority}</Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {topic ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => {
                            if (onViewTheme) {
                              onViewTheme(topic.topicLabel);
                              return;
                            }
                            const target = document.getElementById(
                              themeRowAnchorId(topic.topicLabel)
                            );
                            target?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          aria-label={`View linked theme ${topic.topicLabel}`}
                        >
                          <ArrowUpRight className="size-3.5" />
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
