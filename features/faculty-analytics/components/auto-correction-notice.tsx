"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

type AutoCorrectionNoticeProps = {
  requested: string;
  actual: string;
  paramLabel: string;
  onDismiss?: () => void;
};

export function AutoCorrectionNotice({
  requested,
  actual,
  paramLabel,
  onDismiss,
}: AutoCorrectionNoticeProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="status"
      className="flex items-start justify-between gap-3 rounded-lg border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700/70 dark:bg-amber-950/30 dark:text-amber-100"
    >
      <p className="font-sans leading-snug">
        The <span className="font-medium">{requested}</span> {paramLabel} is not available for this
        scope; showing <span className="font-medium">{actual}</span> instead.
      </p>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Dismiss notice"
        onClick={handleDismiss}
        className="-my-1 size-7 shrink-0 text-amber-900/70 hover:bg-amber-100/60 dark:text-amber-100/70"
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}
