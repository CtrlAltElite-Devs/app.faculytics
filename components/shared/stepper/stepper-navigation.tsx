"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useStepper } from "@/components/shared/stepper/stepper-context";
import { Button } from "@/components/ui/button";

export type StepperNavigationProps = {
  nextLabel?: string;
  prevLabel?: string;
  finalLabel?: string;
  onFinish?: () => void;
  showBackOnFirst?: boolean;
};

export function StepperNavigation({
  nextLabel = "Next",
  prevLabel = "Back",
  finalLabel = "Finish",
  onFinish,
  showBackOnFirst = false,
}: StepperNavigationProps) {
  const { isFirstStep, isLastStep, next, prev } = useStepper();

  return (
    <div className="flex items-center justify-between gap-3">
      {showBackOnFirst ? (
        <Button type="button" variant="outline" onClick={prev} disabled={isFirstStep}>
          <ChevronLeft className="size-4" aria-hidden="true" />
          {prevLabel}
        </Button>
      ) : isFirstStep ? (
        <div />
      ) : (
        <Button type="button" variant="outline" onClick={prev}>
          <ChevronLeft className="size-4" aria-hidden="true" />
          {prevLabel}
        </Button>
      )}

      <Button type="button" onClick={isLastStep ? onFinish : next}>
        {isLastStep ? finalLabel : nextLabel}
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
