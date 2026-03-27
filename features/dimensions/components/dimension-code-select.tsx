"use client";

import { useId, useMemo, useState } from "react";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";

import { useDimensions } from "@/features/dimensions/hooks/use-dimensions";
import { useQuestionnaireTypeId } from "@/features/questionnaires/hooks/use-questionnaire-type-id";
import type { QuestionnaireTypeCode } from "@/features/questionnaires/types";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { normalizeDimensionText } from "@/features/dimensions/lib/dimension-utils";

type DimensionCodeSelectProps = {
  questionnaireType: QuestionnaireTypeCode;
  value: string | null;
  onChange: (code: string | null) => void;
  ariaInvalid?: boolean;
  errorMessage?: string;
};

type DimensionDisplayItem = {
  code: string;
  displayName: string;
};

export function DimensionCodeSelect({
  questionnaireType,
  value,
  onChange,
  ariaInvalid = false,
  errorMessage,
}: DimensionCodeSelectProps) {
  const inputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Resolve code → UUID via cached questionnaire types
  const questionnaireTypeId = useQuestionnaireTypeId(questionnaireType);

  const dimensionsQuery = useDimensions(questionnaireTypeId);
  const activeDimensions = useMemo(() => dimensionsQuery.data?.data ?? [], [dimensionsQuery.data]);

  const selectedDimension = useMemo(
    () => activeDimensions.find((dimension) => dimension.code === value),
    [activeDimensions, value]
  );
  const unavailableSelection = useMemo<DimensionDisplayItem | null>(() => {
    if (!value || selectedDimension || dimensionsQuery.isLoading || dimensionsQuery.isError) {
      return null;
    }

    return { code: value, displayName: value };
  }, [dimensionsQuery.isError, dimensionsQuery.isLoading, selectedDimension, value]);

  const normalizedSearch = normalizeDimensionText(searchValue);
  const selectedDisplayValue =
    selectedDimension?.displayName ?? unavailableSelection?.displayName ?? "";
  const filteredDimensions = useMemo(() => {
    if (!normalizedSearch) {
      return activeDimensions;
    }

    return activeDimensions.filter((dimension) => {
      const displayName = normalizeDimensionText(dimension.displayName);
      const code = normalizeDimensionText(dimension.code);
      return displayName.includes(normalizedSearch) || code.includes(normalizedSearch);
    });
  }, [activeDimensions, normalizedSearch]);

  const selectDimension = (item: DimensionDisplayItem) => {
    onChange(item.code);
    setSearchValue(item.displayName);
    setIsOpen(false);
  };

  const isLoading = !questionnaireTypeId || dimensionsQuery.isLoading;

  return (
    <div className="space-y-2">
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setSearchValue("");
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            role="combobox"
            aria-expanded={isOpen}
            className="h-auto w-full rounded-xl p-0 hover:bg-transparent"
          >
            <InputGroup>
              <InputGroupInput
                id={inputId}
                readOnly
                value={selectedDisplayValue}
                placeholder="Select a dimension"
                aria-invalid={ariaInvalid}
                className="cursor-pointer"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText className="gap-2 text-xs">
                  {isLoading ? "Loading..." : `${activeDimensions.length} codes`}
                  <ChevronsUpDown className="size-4 opacity-50" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={searchValue}
              placeholder="Search dimensions..."
              onValueChange={setSearchValue}
            />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                  <LoaderCircle className="size-4 animate-spin" />
                  Loading dimensions...
                </div>
              ) : (
                <>
                  <CommandEmpty>No matching dimensions.</CommandEmpty>

                  {unavailableSelection ? (
                    <CommandGroup heading="Unavailable Selection">
                      <CommandItem
                        value={`unavailable-${unavailableSelection.code}`}
                        className="text-amber-700"
                        onSelect={() => {
                          selectDimension(unavailableSelection);
                        }}
                      >
                        <Check
                          className={cn(
                            "size-4",
                            value === unavailableSelection.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="truncate">{unavailableSelection.displayName}</span>
                      </CommandItem>
                    </CommandGroup>
                  ) : null}

                  <CommandGroup heading="Available Dimensions">
                    {filteredDimensions.map((dimension) => (
                      <CommandItem
                        key={dimension.id}
                        value={`${dimension.displayName} ${dimension.code}`}
                        onSelect={() => {
                          selectDimension(dimension);
                        }}
                      >
                        <Check
                          className={cn(
                            "size-4",
                            value === dimension.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="truncate">{dimension.displayName}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
      {!errorMessage && unavailableSelection ? (
        <p className="text-sm text-amber-700">
          The saved code &quot;{unavailableSelection.code}&quot; is not in the active registry.
          Re-select it or choose a replacement before publishing.
        </p>
      ) : null}
    </div>
  );
}
