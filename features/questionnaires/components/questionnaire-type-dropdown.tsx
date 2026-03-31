"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getQuestionnaireTypeLabel } from "@/features/questionnaires/constants";
import {
  isSeededQuestionnaireTypeCode,
  type QuestionnaireTypeCode,
} from "@/features/questionnaires/types";

type QuestionnaireTypeOption = {
  code: QuestionnaireTypeCode;
  name?: string | null;
};

type QuestionnaireTypeDropdownProps = {
  types: QuestionnaireTypeOption[];
  value: QuestionnaireTypeCode;
  onValueChange: (value: QuestionnaireTypeCode) => void;
  className?: string;
};

export function QuestionnaireTypeDropdown({
  types,
  value,
  onValueChange,
  className,
}: QuestionnaireTypeDropdownProps) {
  const selectedOption = types.find((type) => type.code === value) ?? null;
  const selectedLabel = selectedOption
    ? getQuestionnaireTypeLabel(value, selectedOption.name)
    : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-between gap-3 lg:min-w-72 lg:max-w-[26rem]", className)}
        >
          <span className="truncate">
            {selectedLabel ??
              (isSeededQuestionnaireTypeCode(value) ? getQuestionnaireTypeLabel(value) : "")}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[18rem] max-w-[24rem]">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(nextValue) => onValueChange(nextValue as QuestionnaireTypeCode)}
        >
          {types.map((type) => (
            <DropdownMenuRadioItem key={type.code} value={type.code}>
              <span className="truncate">{getQuestionnaireTypeLabel(type.code, type.name)}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
