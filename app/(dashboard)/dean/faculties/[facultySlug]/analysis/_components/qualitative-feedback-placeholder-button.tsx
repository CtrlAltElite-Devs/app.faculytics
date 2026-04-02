"use client";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function QualitativeFeedbackPlaceholderButton() {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-disabled="true"
      title="Coming soon"
      className="h-auto px-0 py-0 font-sans text-sm font-medium text-brand-blue hover:bg-transparent hover:text-brand-blue/80"
    >
      <span>View Feedback</span>
      <ArrowUpRight className="size-4" />
    </Button>
  );
}
