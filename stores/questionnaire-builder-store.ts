import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  findSectionById,
  hasMeaningfulDraftContent,
  isLeafSection,
  sortSections,
} from "@/lib/questionnaires/builder-validator";
import type {
  QuestionnaireBuilderDraft,
  QuestionnaireBuilderQualitativeConfig,
  QuestionnaireBuilderQuestionNode,
  QuestionnaireBuilderSectionNode,
  QuestionnaireBuilderServerContext,
  QuestionnaireType,
} from "@/types/questionnaires";

type QuestionnaireBuilderStore = {
  hydrated: boolean;
  activeType: QuestionnaireType | null;
  drafts: Partial<Record<QuestionnaireType, QuestionnaireBuilderDraft>>;
  setHydrated: (hydrated: boolean) => void;
  loadDraftFromServer: (context: QuestionnaireBuilderServerContext) => void;
  setActiveType: (type: QuestionnaireType | null) => void;
  setQuestionnaireRootMetadata: (questionnaireId: string, title: string) => void;
  updateTitle: (title: string) => void;
  selectSection: (sectionId: string | null) => void;
  addRootSection: () => void;
  addChildSection: (parentSectionId: string) => void;
  updateSection: (
    sectionId: string,
    updates: Partial<Pick<QuestionnaireBuilderSectionNode, "title" | "weight">>
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

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function createEmptyQualitativeConfig(): QuestionnaireBuilderQualitativeConfig {
  return {
    enabled: false,
    title: "Additional comments",
    description: "Share any comments that could help improve the questionnaire or teaching experience.",
    placeholder: "Add your observations here.",
    required: false,
  };
}

function createSection(order: number): QuestionnaireBuilderSectionNode {
  return {
    id: createId("section"),
    title: `Section ${order}`,
    order,
    weight: null,
    questions: [],
    children: [],
  };
}

function createQuestion(order: number): QuestionnaireBuilderQuestionNode {
  return {
    id: createId("question"),
    prompt: "",
    type: "LIKERT_1_5",
    order,
    required: true,
  };
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
      titleLocked: false,
      questionnaireTitle: null,
      ...overrides?.metadata,
    },
    sections: overrides?.sections ?? [],
    qualitative: overrides?.qualitative ?? createEmptyQualitativeConfig(),
    selectedSectionId: overrides?.selectedSectionId ?? null,
    hydratedFromServer: overrides?.hydratedFromServer ?? false,
  };
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
      loadDraftFromServer: (context) =>
        set((state) => {
          const existingDraft = state.drafts[context.type];
          const nextTitle =
            context.questionnaireId !== null
              ? context.questionnaireTitle ?? existingDraft?.metadata.title ?? ""
              : existingDraft?.metadata.title ?? "";

          const nextDraft = createDraft(context.type, {
            ...existingDraft,
            metadata: {
              type: context.type,
              title: nextTitle,
              questionnaireId: context.questionnaireId,
              titleLocked: Boolean(context.questionnaireId),
              questionnaireTitle: context.questionnaireTitle,
            },
            selectedSectionId:
              existingDraft?.selectedSectionId ??
              sortSections(existingDraft?.sections ?? [])[0]?.id ??
              null,
            hydratedFromServer: true,
          });

          return {
            activeType: context.type,
            drafts: {
              ...state.drafts,
              [context.type]: nextDraft,
            },
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
            if (!parent) {
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
                weight: isLeafSection(section)
                  ? updates.weight === undefined
                    ? section.weight
                    : updates.weight
                  : null,
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
                    createQuestion(section.questions.length + 1),
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
              ...draft.qualitative,
              ...updates,
            },
          }))
        ),
      resetActiveDraft: () =>
        set((state) => {
          const activeDraft = getActiveDraft(state);
          if (!state.activeType || !activeDraft) {
            return state;
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
          delete nextDrafts[type];

          return {
            drafts: nextDrafts,
          };
        }),
      hasUnsavedChanges: () => hasMeaningfulDraftContent(getActiveDraft(get())),
    }),
    {
      name: "questionnaire-builder-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeType: state.activeType,
        drafts: state.drafts,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
