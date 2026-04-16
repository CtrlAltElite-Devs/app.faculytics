"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { createStore, type StoreApi } from "zustand/vanilla";

import type {
  QuestionnaireFormAnswers,
  QuestionnaireFormValues,
} from "@/features/questionnaires/types";

type QuestionnaireFormState = {
  answers: QuestionnaireFormAnswers;
  qualitativeComment: string;
  setAnswer: (questionId: string, value: number) => void;
  setComment: (value: string) => void;
  getValues: () => QuestionnaireFormValues;
};

export type QuestionnaireFormStore = StoreApi<QuestionnaireFormState>;

export function createQuestionnaireFormStore(
  defaults?: Partial<QuestionnaireFormValues>
): QuestionnaireFormStore {
  return createStore<QuestionnaireFormState>((set, get) => ({
    answers: defaults?.answers ?? {},
    qualitativeComment: defaults?.qualitativeComment ?? "",
    setAnswer: (questionId, value) =>
      set((state) => ({ answers: { ...state.answers, [questionId]: value } })),
    setComment: (value) => set({ qualitativeComment: value }),
    getValues: () => ({
      answers: get().answers,
      qualitativeComment: get().qualitativeComment,
    }),
  }));
}

const QuestionnaireFormStoreContext = createContext<QuestionnaireFormStore | null>(null);

export const QuestionnaireFormStoreProvider = QuestionnaireFormStoreContext.Provider;

function useStoreApi(): QuestionnaireFormStore {
  const store = useContext(QuestionnaireFormStoreContext);
  if (!store) {
    throw new Error(
      "QuestionnaireFormStore missing: component must be rendered inside QuestionnaireFormRenderer"
    );
  }
  return store;
}

export function useQuestionnaireFormStore(): QuestionnaireFormStore {
  return useStoreApi();
}

export function useQuestionAnswer(questionId: string): number | undefined {
  const store = useStoreApi();
  return useSyncExternalStore(
    store.subscribe,
    () => store.getState().answers[questionId],
    () => store.getState().answers[questionId]
  );
}

export function useQualitativeComment(): string {
  const store = useStoreApi();
  return useSyncExternalStore(
    store.subscribe,
    () => store.getState().qualitativeComment,
    () => store.getState().qualitativeComment
  );
}

export function useHasQualitativeContent(): boolean {
  const store = useStoreApi();
  const get = () => store.getState().qualitativeComment.trim().length > 0;
  return useSyncExternalStore(store.subscribe, get, get);
}

export function useAnsweredCountFor(ids: string[]): number {
  const store = useStoreApi();
  const getCount = () => {
    const { answers } = store.getState();
    let count = 0;
    for (const id of ids) if (id in answers) count++;
    return count;
  };
  return useSyncExternalStore(store.subscribe, getCount, getCount);
}

type FormActions = Pick<QuestionnaireFormState, "setAnswer" | "setComment">;

export function useFormActions(): FormActions {
  const store = useStoreApi();
  const { setAnswer, setComment } = store.getState();
  return { setAnswer, setComment };
}
