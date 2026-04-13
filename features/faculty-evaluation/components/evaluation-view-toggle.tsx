"use client";

import { LayoutGrid, Rows3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import type { FacultyEvaluationViewMode } from "@/features/faculty-evaluation/types";

type EvaluationViewToggleProps = {
  value: FacultyEvaluationViewMode;
  onValueChange: (value: FacultyEvaluationViewMode) => void;
};

export function EvaluationViewToggle({ value, onValueChange }: EvaluationViewToggleProps) {
  return (
    <ButtonGroup>
      <Button
        type="button"
        variant={value === "card" ? "brand" : "outline"}
        size="default"
        className="px-4 py-2.5"
        onClick={() => onValueChange("card")}
      >
        <LayoutGrid className="size-4" />
        Card
      </Button>
      <Button
        type="button"
        variant={value === "list" ? "brand" : "outline"}
        size="default"
        className="px-4 py-2.5"
        onClick={() => onValueChange("list")}
      >
        <Rows3 className="size-4" />
        List
      </Button>
    </ButtonGroup>
  );
}
