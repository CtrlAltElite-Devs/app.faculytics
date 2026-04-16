"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const RATING_SCALE_ITEMS = [
  {
    value: "1",
    label: "Strongly Disagree",
    description: "Performance does not conform with University of Cebu standards.",
  },
  {
    value: "2",
    label: "Disagree",
    description: "Performance is below University of Cebu standards.",
  },
  {
    value: "3",
    label: "Neutral",
    description: "Performance is within standards in many instances.",
  },
  {
    value: "4",
    label: "Agree",
    description: "Performance is within standards in most cases.",
  },
  {
    value: "5",
    label: "Strongly Agree",
    description: "Performance exceeds University of Cebu standards consistently.",
  },
] as const;

export function QuestionnaireRatingScaleInstructions() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="gap-0 overflow-hidden border-brand-yellow/90 bg-brand-yellow/30 py-0">
      {/* Mobile: collapsible trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-brand-yellow/10 sm:hidden"
        aria-expanded={open}
        aria-controls="rating-scale-content"
      >
        <span className="flex items-center gap-2.5">
          <Info className="size-4 text-primary/70" aria-hidden="true" />
          <span className="font-playfair text-base font-semibold text-foreground">
            Rating scale
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-primary/70">
          {open ? "Hide" : "Show"}
          <ChevronDown
            className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* Desktop: always-visible header */}
      <CardHeader className="hidden px-6 pt-6 pb-3 sm:block">
        <CardTitle className="font-playfair text-lg">Rating scale</CardTitle>
        <CardDescription className="text-primary">
          Use this scale when reviewing each quantitative statement.
        </CardDescription>
      </CardHeader>

      <div
        id="rating-scale-content"
        className={cn(
          "grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 sm:grid-rows-[1fr]",
          open && "grid-rows-[1fr]"
        )}
      >
        <div className="overflow-hidden">
          <CardContent className="grid gap-2.5 px-5 pb-5 text-sm sm:grid-cols-2 sm:gap-3 sm:px-6 sm:pb-6 lg:grid-cols-5">
            {RATING_SCALE_ITEMS.map((item) => (
              <div
                key={item.value}
                className="flex gap-2.5 rounded-lg bg-white/40 p-2.5 sm:block sm:bg-transparent sm:p-0"
              >
                <span className="font-playfair flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-yellow/70 text-base font-bold text-foreground sm:hidden">
                  {item.value}
                </span>
                <div className="min-w-0">
                  <p className="font-medium leading-tight">
                    <span className="hidden sm:inline">{item.value} - </span>
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-primary sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
