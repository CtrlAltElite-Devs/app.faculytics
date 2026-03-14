"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuestionnaireAddActionButtonProps = {
  className?: string;
  disabled?: boolean;
  label: string;
  onClick: () => void;
};

export function QuestionnaireAddActionButton({
  className,
  disabled = false,
  label,
  onClick,
}: QuestionnaireAddActionButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "h-auto w-full rounded-xl border border-dashed border-muted-foreground/40 px-5 py-4 text-center hover:border-foreground/40 hover:bg-muted/30",
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="font-medium text-muted-foreground">{label}</span>
    </Button>
  );
}
