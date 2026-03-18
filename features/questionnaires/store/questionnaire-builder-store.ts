import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  DEFAULT_BUILDER_QUESTION_TYPE,
  DEFAULT_QUALITATIVE_MAX_LENGTH,
  MAX_SECTION_NESTING_LEVEL,
} from "@/features/questionnaires/constants/builder";
import { deserializeQuestionnaireVersionToDraft } from "@/features/questionnaires/lib/builder-deserializer";
import {
  findSectionById,
  getSectionLevel,
  hasMeaningfulDraftContent,
  isLeafSection,
  sortSections,
} from "@/features/questionnaires/lib/builder-validator";
import type {
  QuestionnaireBuilderDraft,
  QuestionnaireBuilderQualitativeConfig,
  QuestionnaireBuilderQuestionNode,
  QuestionnaireBuilderSectionNode,
  QuestionnaireBuilderServerContext,
  QuestionnaireType,
  QuestionnaireVersionDetail,
} from "@/features/questionnaires/types";

type QuestionnaireBuilderStore = {
  hydrated: boolean;
  activeType: QuestionnaireType | null;
  drafts: Partial<Record<QuestionnaireType, QuestionnaireBuilderDraft>>;
  syncedDrafts: Partial<Record<QuestionnaireType, QuestionnaireBuilderDraft>>;
  setHydrated: (hydrated: boolean) => void;
  loadDraftFromServer: (context: QuestionnaireBuilderServerContext) => void;
  syncDraftVersion: (version: QuestionnaireVersionDetail) => void;
  setActiveType: (type: QuestionnaireType | null) => void;
  setQuestionnaireRootMetadata: (questionnaireId: string, title: string) => void;
  updateTitle: (title: string) => void;
  selectSection: (sectionId: string | null) => void;
  addRootSection: () => void;
  addChildSection: (parentSectionId: string) => void;
  updateSection: (
    sectionId: string,
    updates: Partial<Pick<QuestionnaireBuilderSectionNode, "title" | "weight" | "questionType">>
  ) => void;
  removeSection: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
  addQuestion: (sectionId: string) => void;
  updateQuestion: (
    sectionId: string,
    questionId: string,
    updates: Partial<Pick<QuestionnaireBuilderQuestionNode, "prompt" | "type">>
  ) => void;
  removeQuestion: (sectionId: string, questionId: string) => void;
  updateQualitative: (updates: Partial<QuestionnaireBuilderQualitativeConfig>) => void;
  resetActiveDraft: () => void;
  clearDraftForType: (type: QuestionnaireType) => void;
  hasUnsavedChanges: () => boolean;
};

const QUESTIONNAIRE_BUILDER_STORAGE_KEY = "questionnaire-builder-storage";

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function createEmptyQualitativeConfig(): QuestionnaireBuilderQualitativeConfig {
  return {
    enabled: false,
    required: false,
    maxLength: DEFAULT_QUALITATIVE_MAX_LENGTH,
  };
}

function normalizeQualitativeConfig(
  qualitative?: Partial<QuestionnaireBuilderQualitativeConfig>
): QuestionnaireBuilderQualitativeConfig {
  return {
    ...createEmptyQualitativeConfig(),
    ...qualitative,
    maxLength: qualitative?.maxLength ?? DEFAULT_QUALITATIVE_MAX_LENGTH,
  };
}

function createSection(order: number): QuestionnaireBuilderSectionNode {
  const questionType: QuestionnaireBuilderQuestionNode["type"] = DEFAULT_BUILDER_QUESTION_TYPE;

  return {
    id: createId("section"),
    title: `Section ${order}`,
    order,
    weight: null,
    questionType,
    questions: [createQuestion(1, questionType)],
    children: [],
  };
}

function createQuestion(order: number, type: QuestionnaireBuilderQuestionNode["type"]): QuestionnaireBuilderQuestionNode {
  return {
    id: createId("question"),
    prompt: "",
    type,
    order,
    required: true,
  };
}

function normalizeSections(
  sections: QuestionnaireBuilderSectionNode[]
): QuestionnaireBuilderSectionNode[] {
  return sections.map((section) => {
    const questionType =
      section.questionType ??
      section.questions
        .slice()
        .sort((left, right) => left.order - right.order)[0]?.type ??
      DEFAULT_BUILDER_QUESTION_TYPE;

    return {
      ...section,
      questionType,
      questions: resequenceQuestions(
        section.questions
          .slice()
          .sort((left, right) => left.order - right.order)
          .map((question) => ({
            ...question,
            type: questionType,
          }))
      ),
      children: normalizeSections(section.children),
    };
  });
}

function createDraft(
  type: QuestionnaireType,
  overrides?: Partial<QuestionnaireBuilderDraft>
): QuestionnaireBuilderDraft {
  return {
    metadata: {
      type,
      title: "",
      questionnaireId: null,
      versionId: null,
      titleLocked: false,
      questionnaireTitle: null,
      ...overrides?.metadata,
    },
    sections: normalizeSections(overrides?.sections ?? []),
    qualitative: normalizeQualitativeConfig(overrides?.qualitative),
    selectedSectionId: overrides?.selectedSectionId ?? null,
    hydratedFromServer: overrides?.hydratedFromServer ?? false,
  };
}

function createSyncedDraftSnapshot(
  draft: QuestionnaireBuilderDraft,
  type: QuestionnaireType = draft.metadata.type
): QuestionnaireBuilderDraft {
  return createDraft(type, {
    metadata: {
      ...draft.metadata,
      type,
    },
    sections: draft.sections,
    qualitative: draft.qualitative,
    selectedSectionId:
      draft.selectedSectionId ?? sortSections(draft.sections)[0]?.id ?? null,
    hydratedFromServer: true,
  });
}

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

function draftsMatch(
  left: QuestionnaireBuilderDraft | null | undefined,
  right: QuestionnaireBuilderDraft | null | undefined
) {
  return (
    JSON.stringify(createComparableDraftSnapshot(left ?? null)) ===
    JSON.stringify(createComparableDraftSnapshot(right ?? null))
  );
}

function getActiveDraft(state: QuestionnaireBuilderStore) {
  if (!state.activeType) {
    return null;
  }

  return state.drafts[state.activeType] ?? null;
}

function replaceActiveDraft(
  state: QuestionnaireBuilderStore,
  updater: (draft: QuestionnaireBuilderDraft) => QuestionnaireBuilderDraft
) {
  const activeType = state.activeType;
  if (!activeType) {
    return state;
  }

  const currentDraft = state.drafts[activeType] ?? createDraft(activeType);

  return {
    ...state,
    drafts: {
      ...state.drafts,
      [activeType]: updater(currentDraft),
    },
  };
}

function resequenceQuestions(questions: QuestionnaireBuilderQuestionNode[]) {
  return questions.map((question, index) => ({
    ...question,
    order: index + 1,
  }));
}

function resequenceSections(
  sections: QuestionnaireBuilderSectionNode[]
): QuestionnaireBuilderSectionNode[] {
  return sections.map((section, index) => ({
    ...section,
    order: index + 1,
    children: resequenceSections(sortSections(section.children)),
    questions: resequenceQuestions(
      section.questions.slice().sort((left, right) => left.order - right.order)
    ),
  }));
}

function updateSections(
  sections: QuestionnaireBuilderSectionNode[],
  targetSectionId: string,
  updater: (section: QuestionnaireBuilderSectionNode) => QuestionnaireBuilderSectionNode
): QuestionnaireBuilderSectionNode[] {
  return sections.map((section) => {
    if (section.id === targetSectionId) {
      return updater(section);
    }

    if (section.children.length === 0) {
      return section;
    }

    return {
      ...section,
      children: updateSections(section.children, targetSectionId, updater),
    };
  });
}

function removeSectionFromTree(
  sections: QuestionnaireBuilderSectionNode[],
  sectionId: string
): QuestionnaireBuilderSectionNode[] {
  return sections
    .filter((section) => section.id !== sectionId)
    .map((section) => ({
      ...section,
      children: removeSectionFromTree(section.children, sectionId),
    }));
}

function moveWithinSiblings(
  sections: QuestionnaireBuilderSectionNode[],
  sectionId: string,
  direction: "up" | "down"
): QuestionnaireBuilderSectionNode[] {
  const localIndex = sections.findIndex((section) => section.id === sectionId);

  if (localIndex >= 0) {
    const swapIndex = direction === "up" ? localIndex - 1 : localIndex + 1;
    if (swapIndex < 0 || swapIndex >= sections.length) {
      return sections;
    }

    const next = [...sections];
    [next[localIndex], next[swapIndex]] = [next[swapIndex], next[localIndex]];
    return resequenceSections(next);
  }

  return sections.map((section) => ({
    ...section,
    children: moveWithinSiblings(section.children, sectionId, direction),
  }));
}

function getReplacementSelection(
  sections: QuestionnaireBuilderSectionNode[],
  currentSelectionId: string | null
) {
  if (currentSelectionId && findSectionById(sections, currentSelectionId)) {
    return currentSelectionId;
  }

  return sortSections(sections)[0]?.id ?? null;
}

export const useQuestionnaireBuilderStore = create<QuestionnaireBuilderStore>()(
  persist(
    (set, get) => ({
      hydrated: false,
      activeType: null,
      drafts: {},
      syncedDrafts: {},
      setHydrated: (hydrated) => set({ hydrated }),
      setActiveType: (type) => set({ activeType: type }),
      setQuestionnaireRootMetadata: (questionnaireId, title) =>
        set((state) =>
          replaceActiveDraft(state, (draft) => ({
            ...draft,
            metadata: {
              ...draft.metadata,
              questionnaireId,
              questionnaireTitle: title,
              title: title,
              titleLocked: true,
            },
          }))
        ),
      syncDraftVersion: (version) =>
        set((state) => {
          const syncedDraft = createSyncedDraftSnapshot(
            createDraft(version.questionnaireType, deserializeQuestionnaireVersionToDraft(version))
          );

          return {
            activeType: version.questionnaireType,
            drafts: {
              ...state.drafts,
              [version.questionnaireType]: syncedDraft,
            },
            syncedDrafts: {
              ...state.syncedDrafts,
              [version.questionnaireType]: syncedDraft,
            },
          };
        }),
      loadDraftFromServer: (context) =>
        set((state) => {
          const persistedDraft = state.drafts[context.type] ?? null;
          const persistedSyncedDraft = state.syncedDrafts[context.type];
          const serverDraft = context.draftVersion
            ? createDraft(
                context.type,
                deserializeQuestionnaireVersionToDraft(context.draftVersion)
              )
            : null;
          const fallbackDraft = createDraft(context.type, {
            metadata: {
              type: context.type,
              title: context.questionnaireId !== null ? context.questionnaireTitle ?? "" : "",
              questionnaireId: context.questionnaireId,
              versionId: null,
              titleLocked: Boolean(context.questionnaireId),
              questionnaireTitle: context.questionnaireTitle,
            },
            hydratedFromServer: true,
          });
          const nextDraft = createSyncedDraftSnapshot(
            serverDraft ?? fallbackDraft,
            context.type
          );
          const hasPersistedUnsavedChanges =
            persistedDraft !== null && !draftsMatch(persistedDraft, persistedSyncedDraft ?? null);
          const nextSyncedDrafts = { ...state.syncedDrafts };

          if (context.draftVersion) {
            nextSyncedDrafts[context.type] = nextDraft;
          } else if (persistedSyncedDraft) {
            delete nextSyncedDrafts[context.type];
          }

          const shouldKeepPersistedDraft =
            hasPersistedUnsavedChanges &&
            (!context.draftVersion || draftsMatch(nextDraft, persistedSyncedDraft ?? null));

          return {
            activeType: context.type,
            drafts: {
              ...state.drafts,
              [context.type]: shouldKeepPersistedDraft ? persistedDraft : nextDraft,
            },
            syncedDrafts: nextSyncedDrafts,
          };
        }),
      updateTitle: (title) =>
        set((state) =>
          replaceActiveDraft(state, (draft) => ({
            ...draft,
            metadata: draft.metadata.titleLocked
              ? draft.metadata
              : {
                  ...draft.metadata,
                  title,
                },
          }))
        ),
      selectSection: (sectionId) =>
        set((state) =>
          replaceActiveDraft(state, (draft) => ({
            ...draft,
            selectedSectionId: sectionId,
          }))
        ),
      addRootSection: () =>
        set((state) =>
          replaceActiveDraft(state, (draft) => {
            const nextSection = createSection(draft.sections.length + 1);
            const nextSections = resequenceSections([...draft.sections, nextSection]);

            return {
              ...draft,
              sections: nextSections,
              selectedSectionId: nextSection.id,
            };
          })
        ),
      addChildSection: (parentSectionId) =>
        set((state) =>
          replaceActiveDraft(state, (draft) => {
            const parent = findSectionById(draft.sections, parentSectionId);
            const parentLevel = getSectionLevel(draft.sections, parentSectionId);

            if (!parent || parentLevel === null || parentLevel >= MAX_SECTION_NESTING_LEVEL) {
              return draft;
            }

            const nextSections = updateSections(draft.sections, parentSectionId, (section) => {
              const nextChild = createSection(section.children.length + 1);

              return {
                ...section,
                weight: null,
                questions: [],
                children: resequenceSections([...section.children, nextChild]),
              };
            });

            const nextParent = findSectionById(nextSections, parentSectionId);
            const nextSelection =
              sortSections(nextParent?.children ?? []).at(-1)?.id ??
              getReplacementSelection(nextSections, draft.selectedSectionId);

            return {
              ...draft,
              sections: resequenceSections(nextSections),
              selectedSectionId: nextSelection,
            };
          })
        ),
      updateSection: (sectionId, updates) =>
        set((state) =>
          replaceActiveDraft(state, (draft) => ({
            ...draft,
            sections: resequenceSections(
              updateSections(draft.sections, sectionId, (section) => ({
                ...section,
                ...updates,
                questionType:
                  updates.questionType === undefined ? section.questionType : updates.questionType,
                weight: isLeafSection(section)
                  ? updates.weight === undefined
                    ? section.weight
                    : updates.weight
                  : null,
                questions:
                  updates.questionType === undefined
                    ? section.questions
                    : resequenceQuestions(
                        section.questions.map((question) => ({
                          ...question,
                          type: updates.questionType ?? section.questionType,
                        }))
                      ),
              }))
            ),
          }))
        ),
      removeSection: (sectionId) =>
        set((state) =>
          replaceActiveDraft(state, (draft) => {
            const nextSections = resequenceSections(removeSectionFromTree(draft.sections, sectionId));

            return {
              ...draft,
              sections: nextSections,
              selectedSectionId: getReplacementSelection(nextSections, draft.selectedSectionId),
            };
          })
        ),
      moveSection: (sectionId, direction) =>
        set((state) =>
          replaceActiveDraft(state, (draft) => ({
            ...draft,
            sections: resequenceSections(moveWithinSiblings(draft.sections, sectionId, direction)),
          }))
        ),
      addQuestion: (sectionId) =>
        set((state) =>
          replaceActiveDraft(state, (draft) => ({
            ...draft,
            sections: resequenceSections(
              updateSections(draft.sections, sectionId, (section) => {
                if (!isLeafSection(section)) {
                  return section;
                }

                return {
                  ...section,
                  questions: resequenceQuestions([
                    ...section.questions,
                    createQuestion(section.questions.length + 1, section.questionType),
                  ]),
                };
              })
            ),
          }))
        ),
      updateQuestion: (sectionId, questionId, updates) =>
        set((state) =>
          replaceActiveDraft(state, (draft) => ({
            ...draft,
            sections: resequenceSections(
              updateSections(draft.sections, sectionId, (section) => ({
                ...section,
                questions: resequenceQuestions(
                  section.questions.map((question) =>
                    question.id === questionId
                      ? {
                          ...question,
                          ...updates,
                        }
                      : question
                  )
                ),
              }))
            ),
          }))
        ),
      removeQuestion: (sectionId, questionId) =>
        set((state) =>
          replaceActiveDraft(state, (draft) => ({
            ...draft,
            sections: resequenceSections(
              updateSections(draft.sections, sectionId, (section) => ({
                ...section,
                questions: resequenceQuestions(
                  section.questions.filter((question) => question.id !== questionId)
                ),
              }))
            ),
          }))
        ),
      updateQualitative: (updates) =>
        set((state) =>
          replaceActiveDraft(state, (draft) => ({
            ...draft,
            qualitative: {
              ...normalizeQualitativeConfig(draft.qualitative),
              ...updates,
              maxLength:
                updates.maxLength ??
                draft.qualitative.maxLength ??
                DEFAULT_QUALITATIVE_MAX_LENGTH,
            },
          }))
        ),
      resetActiveDraft: () =>
        set((state) => {
          const activeDraft = getActiveDraft(state);
          if (!state.activeType || !activeDraft) {
            return state;
          }

          const syncedDraft = state.syncedDrafts[state.activeType];
          if (syncedDraft) {
            return {
              ...state,
              drafts: {
                ...state.drafts,
                [state.activeType]: createSyncedDraftSnapshot(syncedDraft, state.activeType),
              },
            };
          }

          return {
            ...state,
            drafts: {
              ...state.drafts,
              [state.activeType]: createDraft(state.activeType, {
                metadata: {
                  ...activeDraft.metadata,
                  title: activeDraft.metadata.titleLocked
                    ? activeDraft.metadata.questionnaireTitle ?? ""
                    : "",
                },
                hydratedFromServer: activeDraft.hydratedFromServer,
              }),
            },
          };
        }),
      clearDraftForType: (type) =>
        set((state) => {
          const nextDrafts = { ...state.drafts };
          const nextSyncedDrafts = { ...state.syncedDrafts };
          delete nextDrafts[type];
          delete nextSyncedDrafts[type];

          return {
            drafts: nextDrafts,
            syncedDrafts: nextSyncedDrafts,
          };
        }),
      hasUnsavedChanges: () => {
        const state = get();
        const activeDraft = getActiveDraft(state);

        if (!activeDraft) {
          return false;
        }

        const syncedDraft = state.activeType ? state.syncedDrafts[state.activeType] ?? null : null;
        if (!syncedDraft) {
          return hasMeaningfulDraftContent(activeDraft);
        }

        return (
          JSON.stringify(createComparableDraftSnapshot(activeDraft)) !==
          JSON.stringify(createComparableDraftSnapshot(syncedDraft))
        );
      },
    }),
    {
      name: QUESTIONNAIRE_BUILDER_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeType: state.activeType,
        drafts: state.drafts,
        syncedDrafts: state.syncedDrafts,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
