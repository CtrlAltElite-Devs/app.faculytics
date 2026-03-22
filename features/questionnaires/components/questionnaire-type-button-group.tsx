"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { QUESTIONNAIRE_TYPE_LABELS } from "@/features/questionnaires/constants";
import type { QuestionnaireType } from "@/features/questionnaires/types";

type QuestionnaireTypeButtonGroupProps = {
  types: QuestionnaireType[];
  value: QuestionnaireType;
  onValueChange: (value: QuestionnaireType) => void;
  className?: string;
};

export function QuestionnaireTypeButtonGroup({
  types,
  value,
  onValueChange,
  className,
}: QuestionnaireTypeButtonGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" className="w-full justify-between gap-3">
              {QUESTIONNAIRE_TYPE_LABELS[value]}
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-56">
            <DropdownMenuRadioGroup
              value={value}
              onValueChange={(nextValue) => onValueChange(nextValue as QuestionnaireType)}
            >
              {types.map((type) => (
                <DropdownMenuRadioItem key={type} value={type}>
                  {QUESTIONNAIRE_TYPE_LABELS[type]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ButtonGroup className="hidden w-full md:flex lg:w-auto lg:min-w-0 lg:max-w-full">
        {types.map((type) => {
          const isActive = type === value;

          return (
            <Button
              key={type}
              type="button"
              variant={isActive ? "default" : "outline"}
              className={cn(
                "min-w-0 flex-1 cursor-pointer px-4 lg:flex-none",
                isActive && "bg-brand-blue/80 text-white hover:bg-brand-blue/70"
              )}
              onClick={() => onValueChange(type)}
            >
              {QUESTIONNAIRE_TYPE_LABELS[type]}
            </Button>
          );
        })}
      </ButtonGroup>
    </div>
  );
}
