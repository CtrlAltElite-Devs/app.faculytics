import type { RecommendedActionDto, TopicSource } from "@/features/faculty-analytics/types";

export type RankedTheme = {
  topicLabel: string;
  commentCount: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  sampleQuotes: string[];
  referencedBy: number;
};

// Max sampleQuotes per theme — matches the backend's Zod cap at
// recommendations.dto.ts:15 (`z.array(z.string()).max(3)`). Do NOT raise
// this without updating the backend schema in lockstep.
const MAX_SAMPLE_QUOTES = 3;

// TODO(post-vitest-adoption): cover in unit test. Pure function, no I/O —
// the single most worth-testing helper on the frontend once RTL lands.
export function aggregateThemes(actions: RecommendedActionDto[]): RankedTheme[] {
  // first-occurrence-wins dedup preserves the LLM emission order — the
  // recommendation engine orders topics by salience, not alphabetically.
  const byLabel = new Map<
    string,
    {
      insertionOrder: number;
      topicLabel: string;
      totalComments: number;
      weightedPositive: number;
      weightedNeutral: number;
      weightedNegative: number;
      quotes: string[];
      actionIds: Set<string>;
    }
  >();

  let insertionCounter = 0;

  for (const action of actions) {
    const sources = action.supportingEvidence?.sources ?? [];
    for (const source of sources) {
      if (source.type !== "topic") continue;
      const topic = source as TopicSource;
      const existing = byLabel.get(topic.topicLabel);
      if (existing) {
        existing.totalComments += topic.commentCount;
        existing.weightedPositive += topic.sentimentBreakdown.positive * topic.commentCount;
        existing.weightedNeutral += topic.sentimentBreakdown.neutral * topic.commentCount;
        existing.weightedNegative += topic.sentimentBreakdown.negative * topic.commentCount;
        for (const quote of topic.sampleQuotes) {
          if (existing.quotes.length < MAX_SAMPLE_QUOTES && !existing.quotes.includes(quote)) {
            existing.quotes.push(quote);
          }
        }
        existing.actionIds.add(action.id);
      } else {
        byLabel.set(topic.topicLabel, {
          insertionOrder: insertionCounter++,
          topicLabel: topic.topicLabel,
          totalComments: topic.commentCount,
          weightedPositive: topic.sentimentBreakdown.positive * topic.commentCount,
          weightedNeutral: topic.sentimentBreakdown.neutral * topic.commentCount,
          weightedNegative: topic.sentimentBreakdown.negative * topic.commentCount,
          quotes: topic.sampleQuotes.slice(0, MAX_SAMPLE_QUOTES),
          actionIds: new Set([action.id]),
        });
      }
    }
  }

  const themes: RankedTheme[] = Array.from(byLabel.values()).map((t) => {
    const total = t.totalComments || 1;
    return {
      topicLabel: t.topicLabel,
      commentCount: t.totalComments,
      sentimentBreakdown: {
        positive: t.weightedPositive / total,
        neutral: t.weightedNeutral / total,
        negative: t.weightedNegative / total,
      },
      sampleQuotes: t.quotes,
      referencedBy: t.actionIds.size,
    };
  });

  // Sort by descending commentCount; tiebreak by original insertion order
  // (preserves LLM emission order for equal-weight topics).
  themes.sort((a, b) => {
    if (b.commentCount !== a.commentCount) return b.commentCount - a.commentCount;
    const aInsert = byLabel.get(a.topicLabel)!.insertionOrder;
    const bInsert = byLabel.get(b.topicLabel)!.insertionOrder;
    return aInsert - bInsert;
  });

  return themes;
}
