// FAC-135 Phase C facet helpers, shrunk post-Step D of the insights-facet
// cleanup spec. Only `formatFacetLabel` + `FACET_LABELS` remain — used by
// `pipeline-confirm-dialog.tsx` for the Voice composition row. The
// filter/derive helpers are gone alongside the Insights facet tabs.

import type { Facet } from "@/features/faculty-analytics/types";

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
