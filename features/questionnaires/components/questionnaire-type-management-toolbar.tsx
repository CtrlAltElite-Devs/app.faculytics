"use client";

import { ChevronDown, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type QuestionnaireTypeManagementFilter = "ALL" | "SYSTEM" | "CUSTOM";

const FILTER_LABELS: Record<QuestionnaireTypeManagementFilter, string> = {
  ALL: "All types",
  SYSTEM: "System types",
  CUSTOM: "Custom types",
};

type QuestionnaireTypeManagementToolbarProps = {
  searchValue: string;
  filter: QuestionnaireTypeManagementFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: QuestionnaireTypeManagementFilter) => void;
  onCreateClick: () => void;
};

export type { QuestionnaireTypeManagementFilter };

export function QuestionnaireTypeManagementToolbar({
  searchValue,
  filter,
  onSearchChange,
  onFilterChange,
  onCreateClick,
}: QuestionnaireTypeManagementToolbarProps) {
  return (
    <>
      <div className="flex flex-col gap-3 lg:hidden">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search questionnaire types..."
            className="pl-9"
            aria-label="Search questionnaire types"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" className="w-full justify-between gap-3">
              {FILTER_LABELS[filter]}
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuRadioGroup
              value={filter}
              onValueChange={(value) => onFilterChange(value as QuestionnaireTypeManagementFilter)}
            >
              {(Object.keys(FILTER_LABELS) as QuestionnaireTypeManagementFilter[]).map((key) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {FILTER_LABELS[key]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button type="button" variant="brand" className="w-full" onClick={onCreateClick}>
          <Plus className="size-4" />
          Create Type
        </Button>
      </div>

      <div className="hidden items-center justify-end gap-3 lg:flex">
        <Button type="button" variant="brand" onClick={onCreateClick}>
          <Plus className="size-4" />
          Create Type
        </Button>

        <div className="relative w-full min-w-0 lg:w-2/5 lg:flex-none xl:w-1/5">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search questionnaire types..."
            className="pl-9"
            aria-label="Search questionnaire types"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-auto shrink-0 justify-between gap-3"
            >
              {FILTER_LABELS[filter]}
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuRadioGroup
              value={filter}
              onValueChange={(value) => onFilterChange(value as QuestionnaireTypeManagementFilter)}
            >
              {(Object.keys(FILTER_LABELS) as QuestionnaireTypeManagementFilter[]).map((key) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {FILTER_LABELS[key]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
