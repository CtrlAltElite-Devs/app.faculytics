"use client";

import { Check } from "lucide-react";

import { useStepper } from "@/components/shared/stepper/stepper-context";
import { cn } from "@/lib/utils";

export type StepperIndicatorProps = {
  steps: Array<{ label: string }>;
  completedSteps?: Set<number>;
};

export function StepperIndicator({
  steps,
  completedSteps = new Set<number>(),
}: StepperIndicatorProps) {
  const { activeStep, allowFreeNavigation, goTo, totalSteps } = useStepper();
  const hasOverflow = steps.length > 6;

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl border bg-muted/20 px-4 py-3 md:hidden"
        role="tablist"
        aria-label="Questionnaire steps"
      >
        <div
          id={`stepper-tab-${activeStep}`}
          role="tab"
          aria-current="step"
          className="text-sm font-medium"
        >
          {`Step ${activeStep + 1} of ${totalSteps}: ${steps[activeStep]?.label ?? "Current step"}`}
        </div>
      </div>

      <div className="relative hidden md:block">
        {hasOverflow ? (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />
          </>
        ) : null}

        <div
          className={cn(
            "rounded-2xl border bg-card px-4 py-5",
            hasOverflow &&
              "overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
          role="tablist"
          aria-label="Questionnaire steps"
        >
          <div className={cn("flex items-start gap-4", hasOverflow ? "min-w-max pr-8" : "")}>
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = completedSteps.has(index) && !isActive;
              const isClickable = allowFreeNavigation;
              const indicatorClassName = cn(
                "flex min-w-[9rem] flex-1 items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
                isClickable && "cursor-pointer hover:border-primary/60 hover:bg-primary/5",
                !isClickable && "cursor-default",
                isCompleted &&
                  "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
                isActive && "border-primary bg-primary/5 ring-2 ring-primary/20",
                !isActive && !isCompleted && "border-border text-muted-foreground"
              );
              const indicatorContent = (
                <>
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                      isCompleted &&
                        "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950",
                      isActive && "border-primary bg-primary text-primary-foreground",
                      !isActive && !isCompleted && "border-border bg-background"
                    )}
                  >
                    {isCompleted ? <Check className="size-4" aria-hidden="true" /> : index + 1}
                  </span>

                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-sm font-medium",
                        !isActive && !isCompleted && "text-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </span>
                </>
              );

              return (
                <div key={`${step.label}-${index}`} className="flex min-w-0 flex-1 items-start gap-4">
                  {isClickable ? (
                    <button
                      id={`stepper-tab-${index}`}
                      type="button"
                      role="tab"
                      aria-current={isActive ? "step" : undefined}
                      aria-selected={isActive}
                      className={indicatorClassName}
                      onClick={() => goTo(index)}
                    >
                      {indicatorContent}
                    </button>
                  ) : (
                    <div
                      id={`stepper-tab-${index}`}
                      role="tab"
                      aria-current={isActive ? "step" : undefined}
                      aria-selected={isActive}
                      className={indicatorClassName}
                    >
                      {indicatorContent}
                    </div>
                  )}

                  {index < steps.length - 1 ? (
                    <div className="mt-4 h-px flex-1 bg-border" aria-hidden="true" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
