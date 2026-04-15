"use client";

import { useMemo } from "react";
import { Lightbulb } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ThemeExplorerCard } from "@/features/faculty-analytics/components/theme-explorer-card";
import type {
  ActionPriority,
  QualitativeThemeDto,
  RecommendedActionDto,
  SentimentLabel,
  TopicSource,
} from "@/features/faculty-analytics/types";

type ThemeExplorerListProps = {
  themes: QualitativeThemeDto[];
  expandedThemeLabel: string | null;
  onToggleTheme: (themeLabel: string | null) => void;
  facultyId: string;
  semesterId: string;
  questionnaireTypeCode: string;
  sentimentFilter: SentimentLabel | null;
  actions: RecommendedActionDto[];
};

const PRIORITY_VARIANT: Record<
  ActionPriority,
  "default" | "secondary" | "destructive" | "outline"
> = {
  HIGH: "destructive",
  MEDIUM: "secondary",
  LOW: "outline",
};

function extractTopicLabel(action: RecommendedActionDto): string | null {
  const topicSource = action.supportingEvidence?.sources.find(
    (s): s is TopicSource => s.type === "topic"
  );
  return topicSource?.topicLabel ?? null;
}

export function ThemeExplorerList({
  themes,
  expandedThemeLabel,
  onToggleTheme,
  facultyId,
  semesterId,
  questionnaireTypeCode,
  sentimentFilter,
  actions,
}: ThemeExplorerListProps) {
  const { actionByTheme, generalActions } = useMemo(() => {
    const byLabel = new Map<string, RecommendedActionDto>();
    const general: RecommendedActionDto[] = [];
    for (const action of actions) {
      const topicLabel = extractTopicLabel(action);
      if (topicLabel && !byLabel.has(topicLabel)) {
        byLabel.set(topicLabel, action);
      } else if (!topicLabel) {
        general.push(action);
      }
    }
    return { actionByTheme: byLabel, generalActions: general };
  }, [actions]);

  if (themes.length === 0) {
    return (
      <section>
        <SectionHeader eyebrow="Qualitative themes" heading="What students are saying" />
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No themes have been identified for this analysis yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <SectionHeader
          eyebrow="Qualitative themes"
          heading="What students are saying"
          subheading={
            <>
              {themes.length} theme{themes.length === 1 ? "" : "s"} emerged from student comments,
              ranked by volume. Expand any row to read student voice and the action tied to that
              theme.
            </>
          }
        />

        <div className="mt-6 space-y-4">
          {themes.map((theme, index) => (
            <ThemeExplorerCard
              key={theme.themeId}
              theme={theme}
              rank={index + 1}
              isExpanded={expandedThemeLabel === theme.label}
              onToggle={() =>
                onToggleTheme(expandedThemeLabel === theme.label ? null : theme.label)
              }
              facultyId={facultyId}
              semesterId={semesterId}
              questionnaireTypeCode={questionnaireTypeCode}
              sentimentFilter={sentimentFilter}
              matchingAction={actionByTheme.get(theme.label) ?? null}
            />
          ))}
        </div>
      </section>

      {generalActions.length > 0 ? (
        <section>
          <SectionHeader
            eyebrow="Cross-cutting"
            heading="General guidance"
            subheading="Recommendations drawn from the overall pattern of feedback, not bound to a single theme."
          />

          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {generalActions.map((action) => (
              <li
                key={action.id}
                className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-foreground/60" aria-hidden />
                    <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                      {action.category === "STRENGTH" ? "Strength" : "Improvement"}
                    </span>
                  </div>
                  <Badge variant={PRIORITY_VARIANT[action.priority]}>{action.priority}</Badge>
                </div>
                <h5 className="mt-3 text-lg font-semibold leading-tight tracking-tight text-foreground">
                  {action.headline}
                </h5>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {action.description}
                </p>
                <div className="mt-4 rounded-xl border border-border/70 bg-muted/30 p-3">
                  <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Plan
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">
                    {action.actionPlan}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  heading,
  subheading,
}: {
  eyebrow: string;
  heading: string;
  subheading?: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{heading}</h2>
      {subheading ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subheading}</p>
      ) : null}
    </div>
  );
}
