import type { QuestionnaireBuilderDraft } from "@/features/questionnaires/types";

function createComparableDraftSnapshot(draft: QuestionnaireBuilderDraft | null) {
  if (!draft) {
    return null;
  }

  return {
    metadata: {
      type: draft.metadata.type,
      title: draft.metadata.title,
      questionnaireId: draft.metadata.questionnaireId,
      versionId: draft.metadata.versionId,
      titleLocked: draft.metadata.titleLocked,
      questionnaireTitle: draft.metadata.questionnaireTitle,
    },
    sections: draft.sections,
    qualitative: draft.qualitative,
  };
}

export function draftsMatch(
  left: QuestionnaireBuilderDraft | null | undefined,
  right: QuestionnaireBuilderDraft | null | undefined
) {
  return (
    JSON.stringify(createComparableDraftSnapshot(left ?? null)) ===
    JSON.stringify(createComparableDraftSnapshot(right ?? null))
  );
}

export { createComparableDraftSnapshot };
