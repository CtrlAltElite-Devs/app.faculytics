"use client";

import { ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  QUESTIONNAIRE_TYPE_LABELS,
  QUESTIONNAIRE_TYPES,
} from "@/features/questionnaires/constants";
import type { QuestionnaireType } from "@/features/questionnaires/types";

type DimensionStatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

const STATUS_FILTER_LABELS: Record<DimensionStatusFilter, string> = {
  ALL: "All statuses",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

type TypeFilter = QuestionnaireType;

type DimensionToolbarProps = {
  typeFilter: TypeFilter;
  statusFilter: DimensionStatusFilter;
  searchValue: string;
  onTypeFilterChange: (value: TypeFilter) => void;
  onStatusFilterChange: (value: DimensionStatusFilter) => void;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
};

export type { DimensionStatusFilter, TypeFilter };

export function DimensionToolbar({
  typeFilter,
  statusFilter,
  searchValue,
  onTypeFilterChange,
  onStatusFilterChange,
  onSearchChange,
  onCreateClick,
}: DimensionToolbarProps) {
  return (
    <>
      {/* Mobile layout */}
      <div className="flex flex-col gap-3 lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" className="w-full justify-between gap-3">
              {QUESTIONNAIRE_TYPE_LABELS[typeFilter]}
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-56">
            <DropdownMenuRadioGroup
              value={typeFilter}
              onValueChange={(v) => onTypeFilterChange(v as TypeFilter)}
            >
              {QUESTIONNAIRE_TYPES.map((type) => (
                <DropdownMenuRadioItem key={type} value={type}>
                  {QUESTIONNAIRE_TYPE_LABELS[type]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search dimensions..."
            className="pl-9"
            aria-label="Search dimensions"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" className="w-full justify-between gap-3">
              {STATUS_FILTER_LABELS[statusFilter]}
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuRadioGroup
              value={statusFilter}
              onValueChange={(v) => onStatusFilterChange(v as DimensionStatusFilter)}
            >
              {(Object.keys(STATUS_FILTER_LABELS) as DimensionStatusFilter[]).map((key) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {STATUS_FILTER_LABELS[key]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button type="button" variant="brand" className="w-full" onClick={onCreateClick}>
          Create Dimension
        </Button>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex lg:min-w-0 lg:flex-row lg:items-center lg:gap-3">
        <ButtonGroup className="shrink-0">
          {QUESTIONNAIRE_TYPES.map((type) => {
            const isActive = type === typeFilter;

            return (
              <Button
                key={type}
                type="button"
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "min-w-0 cursor-pointer px-4",
                  isActive && "bg-brand-blue/80 text-white hover:bg-brand-blue/70"
                )}
                onClick={() => onTypeFilterChange(type)}
              >
                {QUESTIONNAIRE_TYPE_LABELS[type]}
              </Button>
            );
          })}
        </ButtonGroup>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <Button type="button" variant="brand" className="shrink-0" onClick={onCreateClick}>
            Create Dimension
          </Button>

          <div className="relative w-full min-w-0 lg:w-2/5 lg:flex-none xl:w-1/6">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dimensions..."
              className="pl-9"
              aria-label="Search dimensions"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-auto shrink-0 justify-between gap-3"
              >
                {STATUS_FILTER_LABELS[statusFilter]}
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuRadioGroup
                value={statusFilter}
                onValueChange={(v) => onStatusFilterChange(v as DimensionStatusFilter)}
              >
                {(Object.keys(STATUS_FILTER_LABELS) as DimensionStatusFilter[]).map((key) => (
                  <DropdownMenuRadioItem key={key} value={key}>
                    {STATUS_FILTER_LABELS[key]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
