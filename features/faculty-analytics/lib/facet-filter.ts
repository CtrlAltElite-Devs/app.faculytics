// FAC-135 Phase C (Task C3): pure helpers for client-side facet filtering.
//
// Strategy (locked per tech spec): themes inherit facet from their source
// recommendation via a client-side join on topicLabel (the only stable
// identifier available on both `QualitativeThemeDto` and
// `RecommendedActionDto.supportingEvidence.sources[].topicLabel`). No API
// DTO change to `QualitativeThemeDto` — keeps the contract surface stable.
//
// These are pure functions. No React, no network. Easy to unit-test.

import type {
  Facet,
  QualitativeThemeDto,
  RecommendedActionDto,
  TopicSource,
} from "@/features/faculty-analytics/types";

const FACET_LABELS: Record<Facet, string> = {
  overall: "Overall",
  facultyFeedback: "Faculty Feedback",
  inClassroom: "In-Classroom",
  outOfClassroom: "Out-of-Classroom",
};

/**
 * Maps a Facet enum value to its display label. Never coerce enum values
 * directly to display strings — always go through this helper.
 */
export function formatFacetLabel(facet: Facet): string {
  return FACET_LABELS[facet];
}

export const FACET_ORDER: readonly Facet[] = [
  "overall",
  "facultyFeedback",
  "inClassroom",
  "outOfClassroom",
];

/**
 * Returns the subset of actions matching the selected facet. When
 * `facet === 'overall'` returns the full input (overall is the aggregate
 * view — all actions regardless of facet tag).
 */
export function filterActionsByFacet(
  actions: RecommendedActionDto[],
  facet: Facet
): RecommendedActionDto[] {
  if (facet === "overall") return actions;
  return actions.filter((action) => action.facet === facet);
}

/**
 * Derives a Map<themeId, Facet> by joining themes to their source
 * recommendation via the topic label on `supportingEvidence.sources`. The
 * first matching action's facet is assigned; themes without a matching
 * action default to `'overall'` (they remain visible in all views).
 */
export function deriveThemeFacets(
  themes: QualitativeThemeDto[],
  actions: RecommendedActionDto[]
): Map<string, Facet> {
  // Build a label -> facet lookup from the actions. Multiple actions may
  // cite the same topic; the first wins (stable w.r.t. action order).
  const facetByLabel = new Map<string, Facet>();
  for (const action of actions) {
    const topicSources = action.supportingEvidence?.sources.filter(
      (source): source is TopicSource => source.type === "topic"
    );
    if (!topicSources) continue;
    for (const source of topicSources) {
      if (!facetByLabel.has(source.topicLabel)) {
        facetByLabel.set(source.topicLabel, action.facet);
      }
    }
  }

  const themeFacets = new Map<string, Facet>();
  for (const theme of themes) {
    themeFacets.set(theme.themeId, facetByLabel.get(theme.label) ?? "overall");
  }
  return themeFacets;
}

/**
 * Filters themes by the derived facet map. `'overall'` returns the full
 * list. Themes with a derived facet matching the requested facet are kept;
 * themes whose default is `'overall'` only appear in the overall view.
 */
export function filterThemesByFacet(
  themes: QualitativeThemeDto[],
  themeFacets: Map<string, Facet>,
  facet: Facet
): QualitativeThemeDto[] {
  if (facet === "overall") return themes;
  return themes.filter((theme) => themeFacets.get(theme.themeId) === facet);
}
