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
import {
  QUESTIONNAIRE_STATUS_FILTER_LABELS,
  QUESTIONNAIRE_STATUSES,
  type QuestionnaireStatusFilter,
} from "@/features/questionnaires/types";

type QuestionnaireStatusFilterProps = {
  value: QuestionnaireStatusFilter;
  onValueChange: (value: QuestionnaireStatusFilter) => void;
  className?: string;
};

export function QuestionnaireStatusFilter({
  value,
  onValueChange,
  className,
}: QuestionnaireStatusFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" className={className ?? "justify-between gap-3"}>
          {QUESTIONNAIRE_STATUS_FILTER_LABELS[value]}
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(nextValue) => onValueChange(nextValue as QuestionnaireStatusFilter)}
        >
          <DropdownMenuRadioItem value="ALL">
            {QUESTIONNAIRE_STATUS_FILTER_LABELS.ALL}
          </DropdownMenuRadioItem>
          {QUESTIONNAIRE_STATUSES.map((status) => (
            <DropdownMenuRadioItem key={status} value={status}>
              {QUESTIONNAIRE_STATUS_FILTER_LABELS[status]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
