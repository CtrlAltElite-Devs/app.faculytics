"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type StepperContextValue = {
  activeStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  allowFreeNavigation: boolean;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
};

export type StepperProviderProps = {
  children: ReactNode;
  totalSteps: number;
  initialStep?: number;
  allowFreeNavigation?: boolean;
  onStepChange?: (step: number) => void;
};

const StepperContext = createContext<StepperContextValue | null>(null);

function scrollToTop() {
  if (typeof window === "undefined") {
    return;
  }

  window.scrollTo({
    top: 0,
    behavior: "instant" as ScrollBehavior,
  });
}

export function StepperProvider({
  children,
  totalSteps,
  initialStep = 0,
  allowFreeNavigation = true,
  onStepChange,
}: StepperProviderProps) {
  const maxStepIndex = Math.max(totalSteps - 1, 0);
  const clampStep = (step: number) => Math.min(Math.max(step, 0), maxStepIndex);
  const [rawActiveStep, setRawActiveStep] = useState(() => clampStep(initialStep));

  const setStep = (nextStep: number) => {
    let changedTo: number | null = null;

    setRawActiveStep((currentStep) => {
      const clampedStep = clampStep(nextStep);

      if (clampedStep === currentStep) {
        return currentStep;
      }

      changedTo = clampedStep;
      return clampedStep;
    });

    if (changedTo === null) {
      return;
    }

    scrollToTop();
    onStepChange?.(changedTo);
  };

  const activeStep = clampStep(rawActiveStep);
  const value: StepperContextValue = {
    activeStep,
    totalSteps,
    isFirstStep: activeStep === 0,
    isLastStep: activeStep >= maxStepIndex,
    allowFreeNavigation,
    next: () => setStep(activeStep + 1),
    prev: () => setStep(activeStep - 1),
    goTo: (index) => setStep(index),
  };

  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>;
}

export function useStepper() {
  const context = useContext(StepperContext);

  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider.");
  }

  return context;
}
