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

        <div className="flex w-full flex-col gap-3 lg:w-full lg:max-w-xl lg:self-end xl:w-auto xl:max-w-none">
          <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
            {!hasDraftVersion ? (
              <Button asChild variant="brand" className="lg:self-stretch xl:self-auto">
                <Link href={createDraftHref}>Create Draft</Link>
              </Button>
            ) : null}
            <QuestionnaireSearchInput
              value={searchValue}
              onChange={onSearchChange}
              className="relative w-full lg:flex-1 xl:min-w-80 xl:flex-none"
            />
          </div>
          <QuestionnaireStatusFilter
            value={statusFilter}
            onValueChange={onStatusFilterChange}
            className="w-full justify-between gap-3 lg:w-fit lg:min-w-44 lg:self-end"
          />
        </div>
      </div>
    </>
  );
}
