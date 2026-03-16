"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type QuestionnaireSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function QuestionnaireSearchInput({
  value,
  onChange,
  className,
}: QuestionnaireSearchInputProps) {
  return (
    <div className={className ?? "relative w-full md:max-w-sm"}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search version"
        className="pl-9"
        aria-label="Search version"
      />
    </div>
  );
}
