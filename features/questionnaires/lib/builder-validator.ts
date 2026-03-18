import {
  questionnaireQualitativeConfigSchema,
  questionnaireQuestionInputSchema,
  questionnaireSectionInputSchema,
} from "@/features/questionnaires/schemas";
import type {
  QuestionnaireBuilderDraft,
  QuestionnaireBuilderSectionNode,
  QuestionnaireBuilderValidationIssue,
  QuestionnaireBuilderValidationResult,
} from "@/features/questionnaires/types";

export function isLeafSection(section: QuestionnaireBuilderSectionNode) {
  return section.children.length === 0;
}

export function sortSections(sections: QuestionnaireBuilderSectionNode[]) {
  return [...sections].sort((left, right) => left.order - right.order);
}

export function findSectionById(
  sections: QuestionnaireBuilderSectionNode[],
  sectionId: string | null
): QuestionnaireBuilderSectionNode | null {
  if (!sectionId) {
    return null;
  }

  for (const section of sections) {
    if (section.id === sectionId) {
      return section;
    }

    const nestedMatch = findSectionById(section.children, sectionId);
    if (nestedMatch) {
      return nestedMatch;
    }
  }

  return null;
}

export function getSectionLevel(
  sections: QuestionnaireBuilderSectionNode[],
  sectionId: string | null,
  currentLevel = 1
): number | null {
  if (!sectionId) {
    return null;
  }

  for (const section of sections) {
    if (section.id === sectionId) {
      return currentLevel;
    }

    const nestedLevel = getSectionLevel(section.children, sectionId, currentLevel + 1);
    if (nestedLevel !== null) {
      return nestedLevel;
    }
  }

  return null;
}

export function collectLeafSections(
  sections: QuestionnaireBuilderSectionNode[]
): QuestionnaireBuilderSectionNode[] {
  return sortSections(sections).flatMap((section) => {
    if (isLeafSection(section)) {
      return [section];
    }

    return collectLeafSections(section.children);
  });
}

export function hasMeaningfulDraftContent(draft: QuestionnaireBuilderDraft | null) {
  if (!draft) {
    return false;
  }

  const hasSections = draft.sections.length > 0;
  const hasQualitative = draft.qualitative.enabled;
  const hasEditableTitle = draft.metadata.title.trim().length > 0;

  return hasSections || hasQualitative || hasEditableTitle;
}

export function canConvertSectionToParent(section: QuestionnaireBuilderSectionNode | null) {
  if (!section) {
    return {
      requiresConfirmation: false,
      questionCount: 0,
      hasWeight: false,
    };
  }

  return {
    requiresConfirmation:
      isLeafSection(section) && (section.questions.length > 0 || section.weight !== null),
    questionCount: section.questions.length,
    hasWeight: section.weight !== null,
  };
}

function appendIssue(
  issues: QuestionnaireBuilderValidationIssue[],
  issue: QuestionnaireBuilderValidationIssue
) {
  issues.push(issue);
}

export function validateQuestionnaireBuilderDraft(
  draft: QuestionnaireBuilderDraft
): QuestionnaireBuilderValidationResult {
  const issues: QuestionnaireBuilderValidationIssue[] = [];
  const sectionIssues: Record<string, QuestionnaireBuilderValidationIssue[]> = {};
  const questionIssues: Record<string, QuestionnaireBuilderValidationIssue[]> = {};
  const qualitativeIssues: QuestionnaireBuilderValidationIssue[] = [];
  let totalLeafWeight = 0;
  let leafSectionCount = 0;

  if (draft.metadata.title.trim().length === 0) {
    appendIssue(issues, {
      code: "metadata.title.required",
      message: "Questionnaire title is required before saving.",
      target: { type: "global" },
    });
  }

  if (draft.sections.length === 0) {
    appendIssue(issues, {
      code: "sections.required",
      message: "Add at least one quantitative section before saving.",
      target: { type: "global" },
    });
  }

  const visitSection = (section: QuestionnaireBuilderSectionNode) => {
    const localSectionIssues: QuestionnaireBuilderValidationIssue[] = [];
    const titleResult = questionnaireSectionInputSchema.shape.title.safeParse(section.title);

    if (!titleResult.success) {
      const issue: QuestionnaireBuilderValidationIssue = {
        code: "section.title.invalid",
        message: titleResult.error.issues[0]?.message ?? "Section title is required.",
        target: {
          type: "section",
          id: section.id,
          field: "title",
        },
      };

      localSectionIssues.push(issue);
      appendIssue(issues, issue);
    }

    if (isLeafSection(section)) {
      leafSectionCount += 1;

      const weightResult = questionnaireSectionInputSchema.shape.weight.safeParse(section.weight);
      if (!weightResult.success || section.weight === null) {
        const issue: QuestionnaireBuilderValidationIssue = {
          code: "section.weight.required",
          message: "Leaf sections must have a weight between 1 and 100.",
          target: {
            type: "section",
            id: section.id,
            field: "weight",
          },
        };

        localSectionIssues.push(issue);
        appendIssue(issues, issue);
      } else {
        totalLeafWeight += section.weight;
      }

      if (section.questions.length === 0) {
        const issue: QuestionnaireBuilderValidationIssue = {
          code: "section.questions.required",
          message: "Leaf sections must contain at least one question.",
          target: {
            type: "section",
            id: section.id,
            field: "questions",
          },
        };

        localSectionIssues.push(issue);
        appendIssue(issues, issue);
      }
    } else {
      if (section.weight !== null) {
        const issue: QuestionnaireBuilderValidationIssue = {
          code: "section.weight.non_leaf",
          message: "Only leaf sections may carry weights.",
          target: {
            type: "section",
            id: section.id,
            field: "weight",
          },
        };

        localSectionIssues.push(issue);
        appendIssue(issues, issue);
      }

      if (section.questions.length > 0) {
        const issue: QuestionnaireBuilderValidationIssue = {
          code: "section.questions.non_leaf",
          message: "Parent sections cannot keep direct questions.",
          target: {
            type: "section",
            id: section.id,
            field: "structure",
          },
        };

        localSectionIssues.push(issue);
        appendIssue(issues, issue);
      }
    }

    section.questions
      .slice()
      .sort((left, right) => left.order - right.order)
      .forEach((question) => {
        const localQuestionIssues: QuestionnaireBuilderValidationIssue[] = [];
        const questionResult = questionnaireQuestionInputSchema.safeParse({
          prompt: question.prompt,
          type: question.type,
        });

        if (!questionResult.success) {
          for (const zodIssue of questionResult.error.issues) {
            const issue: QuestionnaireBuilderValidationIssue = {
              code: `question.${zodIssue.path.join(".") || "invalid"}`,
              message: zodIssue.message,
              target: {
                type: "question",
                id: question.id,
                sectionId: section.id,
                field: zodIssue.path[0] === "type" ? "type" : "prompt",
              },
            };

            localQuestionIssues.push(issue);
            appendIssue(issues, issue);
          }
        }

        if (!isLeafSection(section)) {
          const issue: QuestionnaireBuilderValidationIssue = {
            code: "question.parent_section",
            message: "Questions can only exist on leaf sections.",
            target: {
              type: "question",
              id: question.id,
              sectionId: section.id,
              field: "type",
            },
          };

          localQuestionIssues.push(issue);
          appendIssue(issues, issue);
        }

        if (localQuestionIssues.length > 0) {
          questionIssues[question.id] = localQuestionIssues;
        }
      });

    if (localSectionIssues.length > 0) {
      sectionIssues[section.id] = localSectionIssues;
    }

    sortSections(section.children).forEach(visitSection);
  };

  sortSections(draft.sections).forEach(visitSection);

  if (leafSectionCount > 0 && totalLeafWeight !== 100) {
    appendIssue(issues, {
      code: "weights.total.invalid",
      message: `Weights must total exactly 100. Current total: ${totalLeafWeight}.`,
      target: { type: "global" },
    });
  }

  if (draft.qualitative.enabled) {
    const qualitativeResult = questionnaireQualitativeConfigSchema.safeParse(draft.qualitative);
    if (!qualitativeResult.success) {
      for (const zodIssue of qualitativeResult.error.issues) {
        const issue: QuestionnaireBuilderValidationIssue = {
          code: `qualitative.${zodIssue.path.join(".") || "invalid"}`,
          message: zodIssue.message,
          target: {
            type: "qualitative",
            field: "maxLength",
          },
        };

        qualitativeIssues.push(issue);
        appendIssue(issues, issue);
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    sectionIssues,
    questionIssues,
    qualitativeIssues,
    totalLeafWeight,
    leafSectionCount,
  };
}
