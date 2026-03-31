"use client";

import { LayoutGrid, Rows3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

type CoursesViewMode = "card" | "list";

type CoursesViewToggleProps = {
  value: CoursesViewMode;
  onValueChange: (value: CoursesViewMode) => void;
};

export type { CoursesViewMode };

export function CoursesViewToggle({ value, onValueChange }: CoursesViewToggleProps) {
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
