"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type {
  QuestionnaireBuilderPreviewModel,
  QuestionnaireBuilderPreviewSection,
  QuestionnaireFormMode,
  QuestionnaireFormValues,
} from "@/features/questionnaires/types";

import { QuestionnaireFormProgress } from "./questionnaire-form-progress";
import { QuestionnaireFormQualitative } from "./questionnaire-form-qualitative";
import { QuestionnaireFormSection } from "./questionnaire-form-section";
import {
  createQuestionnaireFormStore,
  QuestionnaireFormStoreProvider,
} from "./questionnaire-form-store";

type QuestionnaireFormRendererProps = {
  /** The questionnaire data to render (sections, questions, qualitative config). */
  model: QuestionnaireBuilderPreviewModel;
  /** "preview" disables all inputs; "interactive" enables answering. */
  mode: QuestionnaireFormMode;
  /** Pre-fill the form with saved draft data. Only used in interactive mode. */
  defaultValues?: Partial<QuestionnaireFormValues>;
  /** Called whenever a form value changes. Only fires in interactive mode. */
  onChange?: (values: QuestionnaireFormValues) => void;
  /** Optional slot rendered beside the progress percentage (e.g. draft status badge). */
  progressTrailing?: React.ReactNode;
  /** Faculty being evaluated; surfaced inside the sticky progress header. */
  facultyName?: string;
};

/**
 * Recursively collects IDs of all required questions across all sections.
 * Used to track completion progress (how many required questions are answered).
 */
function collectRequiredQuestionIds(sections: QuestionnaireBuilderPreviewSection[]): string[] {
  return sections.flatMap((section) => {
    if (section.questions.length > 0) {
      return section.questions.filter((q) => q.required).map((q) => q.id);
    }
    return collectRequiredQuestionIds(section.children);
  });
}

export function QuestionnaireFormRenderer({
  model,
  mode,
  defaultValues,
  onChange,
  progressTrailing,
  facultyName,
}: QuestionnaireFormRendererProps) {
  const isInteractive = mode === "interactive";

  // Lazy-init: one store per mount. `defaultValues` is captured here — matches
  // the previous useState(initialValue) semantics.
  const [store] = useState(() => createQuestionnaireFormStore(defaultValues));

  const requiredQuestionIds = useMemo(
    () => collectRequiredQuestionIds(model.sections),
    [model.sections]
  );

  // Autosave wiring lives outside React's render cycle: store.subscribe fires
  // only when state actually changes, and mutating a ref + calling the stable
  // debounced callback does not cause the renderer to re-render.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!isInteractive) return;
    return store.subscribe((state, prev) => {
      if (state.answers === prev.answers && state.qualitativeComment === prev.qualitativeComment) {
        return;
      }
      onChangeRef.current?.({
        answers: state.answers,
        qualitativeComment: state.qualitativeComment,
      });
    });
  }, [store, isInteractive]);

  return (
    <QuestionnaireFormStoreProvider value={store}>
      <div className="space-y-5">
        {isInteractive && (
          <QuestionnaireFormProgress
            requiredIds={requiredQuestionIds}
            qualitativeRequired={model.qualitative.required}
            trailing={progressTrailing}
            facultyName={facultyName}
          />
        )}

        {model.sections.map((section) => (
          <QuestionnaireFormSection key={section.id} section={section} mode={mode} />
        ))}

        {model.qualitative.enabled && (
          <QuestionnaireFormQualitative config={model.qualitative} mode={mode} />
        )}
      </div>
    </QuestionnaireFormStoreProvider>
  );
}
