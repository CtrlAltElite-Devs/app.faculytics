"use client";

import { LayoutGrid, Rows3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export type EvaluationViewMode = "card" | "list";

type EvaluationViewToggleProps = {
  value: EvaluationViewMode;
  onValueChange: (value: EvaluationViewMode) => void;
};

export function EvaluationViewToggle({
  value,
  onValueChange,
}: EvaluationViewToggleProps) {
  return (
    <ButtonGroup>
      <Button
        type="button"
        variant={value === "card" ? "brand" : "outline"}
        size="sm"
        className="px-3"
        onClick={() => onValueChange("card")}
      >
        <LayoutGrid className="size-4" />
        Card
      </Button>
      <Button
        type="button"
        variant={value === "list" ? "brand" : "outline"}
        size="sm"
        className="px-3"
        onClick={() => onValueChange("list")}
      >
        <Rows3 className="size-4" />
        List
      </Button>
    </ButtonGroup>
  );
}
