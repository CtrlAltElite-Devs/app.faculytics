"use client";

import Link from "next/link";

import { QuestionnaireSearchInput } from "@/features/questionnaires/components/questionnaire-search-input";
import { QuestionnaireStatusFilter } from "@/features/questionnaires/components/questionnaire-status-filter";
import { QuestionnaireTypeButtonGroup } from "@/features/questionnaires/components/questionnaire-type-button-group";
import { Button } from "@/components/ui/button";
import type {
  QuestionnaireStatusFilter as StatusFilter,
  QuestionnaireType,
} from "@/features/questionnaires/types";

type QuestionnaireListToolbarProps = {
  availableTypes: QuestionnaireType[];
  activeType: QuestionnaireType;
  statusFilter: StatusFilter;
  searchValue: string;
  hasDraftVersion: boolean;
  onTypeChange: (nextType: QuestionnaireType) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  onSearchChange: (value: string) => void;
};

export function QuestionnaireListToolbar({
  availableTypes,
  activeType,
  statusFilter,
  searchValue,
  hasDraftVersion,
  onTypeChange,
  onStatusFilterChange,
  onSearchChange,
}: QuestionnaireListToolbarProps) {
  const createDraftHref = `/superadmin/questionnaires/new?type=${activeType}`;

  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        <QuestionnaireTypeButtonGroup
          types={availableTypes}
          value={activeType}
          onValueChange={onTypeChange}
        />
        <QuestionnaireStatusFilter
          value={statusFilter}
          onValueChange={onStatusFilterChange}
          className="w-full justify-between gap-3"
        />
        {!hasDraftVersion ? (
          <Button asChild variant="brand" className="w-full">
            <Link href={createDraftHref}>Create Draft</Link>
          </Button>
        ) : null}
        <QuestionnaireSearchInput
          value={searchValue}
          onChange={onSearchChange}
          className="relative w-full"
        />
      </div>

      <div className="hidden md:flex md:flex-col md:gap-4 lg:flex-row lg:items-end lg:justify-between">
        <QuestionnaireTypeButtonGroup
          types={availableTypes}
          value={activeType}
          onValueChange={onTypeChange}
        />

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
            {!hasDraftVersion ? (
              <Button asChild variant="brand" className="sm:self-stretch">
                <Link href={createDraftHref}>Create Draft</Link>
              </Button>
            ) : null}
            <QuestionnaireSearchInput value={searchValue} onChange={onSearchChange} />
          </div>
          <QuestionnaireStatusFilter value={statusFilter} onValueChange={onStatusFilterChange} />
        </div>
      </div>
    </>
  );
}
