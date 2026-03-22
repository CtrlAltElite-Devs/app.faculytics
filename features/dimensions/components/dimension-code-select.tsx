"use client";

import { useId, useMemo, useState } from "react";
import { Check, ChevronsUpDown, LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";

import { useCreateDimension } from "@/features/dimensions/hooks/use-create-dimension";
import { useDimensions } from "@/features/dimensions/hooks/use-dimensions";
import { resolveCreateDimensionErrorMessage } from "@/features/dimensions/lib/action-errors";
import type { Dimension } from "@/features/dimensions/types";
import type { QuestionnaireType } from "@/features/questionnaires/types";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DimensionCodeSelectProps = {
  questionnaireType: QuestionnaireType;
  value: string | null;
  onChange: (code: string | null) => void;
  ariaInvalid?: boolean;
  errorMessage?: string;
};

function normalizeDimensionText(value: string) {
  return value.trim().toLowerCase();
}

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
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  const dimensionsQuery = useDimensions(questionnaireType);
  const createDimensionMutation = useCreateDimension();
  const activeDimensions = useMemo(() => dimensionsQuery.data?.data ?? [], [dimensionsQuery.data]);

  const selectedDimension = useMemo(
    () => activeDimensions.find((dimension) => dimension.code === value) ?? null,
    [activeDimensions, value]
  );
  const unavailableSelectedDimension = useMemo<Dimension | null>(() => {
    if (!value || selectedDimension || dimensionsQuery.isLoading || dimensionsQuery.isError) {
      return null;
    }

    return {
      id: `unavailable-${value}`,
      code: value,
      displayName: value,
      questionnaireType,
      active: false,
      createdAt: "",
      updatedAt: "",
    };
  }, [dimensionsQuery.isError, dimensionsQuery.isLoading, questionnaireType, selectedDimension, value]);

  const normalizedSearch = normalizeDimensionText(searchValue);
  const selectedDisplayValue =
    selectedDimension?.displayName ?? unavailableSelectedDimension?.displayName ?? "";
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

  const hasExactMatch = useMemo(() => {
    if (!normalizedSearch) {
      return false;
    }

    return activeDimensions.some((dimension) => {
      return (
        normalizeDimensionText(dimension.displayName) === normalizedSearch ||
        normalizeDimensionText(dimension.code) === normalizedSearch
      );
    });
  }, [activeDimensions, normalizedSearch]);

  const canCreate = normalizedSearch.length > 0 && !hasExactMatch;

  const selectDimension = (
    dimension: Dimension,
    options?: {
      toastMessage?: string;
    }
  ) => {
    const nextCode = dimension.code;
    const previousCode = value;

    onChange(dimension.code);
    setLocalMessage(null);
    setSearchValue(dimension.displayName);
    setIsOpen(false);

    if (nextCode !== previousCode && options?.toastMessage) {
      toast.success(options.toastMessage);
    }
  };

  const handleCreateDimension = async () => {
    const displayName = searchValue.trim();
    if (!displayName) {
      return;
    }

    try {
      const createdDimension = await createDimensionMutation.mutateAsync({
        displayName,
        questionnaireType,
      });
      selectDimension(createdDimension, {
        toastMessage: `Dimension "${createdDimension.displayName}" created and selected.`,
      });
    } catch (error) {
      setLocalMessage(
        resolveCreateDimensionErrorMessage(
          error,
          "Unable to create that dimension right now. Please try again."
        )
      );
      await dimensionsQuery.refetch();
      if (typeof document !== "undefined") {
        document.getElementById(inputId)?.focus();
      }
    }
  };

  const helperMessage = errorMessage ?? localMessage;

  return (
    <div className="space-y-2">
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setSearchValue("");
          } else {
            setLocalMessage(null);
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
                placeholder="Select or create a dimension"
                aria-invalid={ariaInvalid}
                className="cursor-pointer"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText className="gap-2 text-xs">
                  {dimensionsQuery.isLoading ? "Loading..." : `${activeDimensions.length} codes`}
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
              placeholder="Search or create a dimension..."
              onValueChange={(value) => {
                setSearchValue(value);
                setLocalMessage(null);
              }}
            />
            <CommandList>
              {dimensionsQuery.isLoading ? (
                <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                  <LoaderCircle className="size-4 animate-spin" />
                  Loading dimensions...
                </div>
              ) : (
                <>
                  <CommandEmpty>No matching dimensions.</CommandEmpty>

                  {unavailableSelectedDimension ? (
                    <CommandGroup heading="Unavailable Selection">
                      <CommandItem
                        value={`unavailable-${unavailableSelectedDimension.code}`}
                        className="text-amber-700"
                        onSelect={() => {
                          selectDimension(unavailableSelectedDimension);
                        }}
                      >
                        <Check
                          className={cn(
                            "size-4",
                            value === unavailableSelectedDimension.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="truncate">{unavailableSelectedDimension.displayName}</span>
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

                  {canCreate ? (
                    <>
                      <CommandSeparator />
                      <CommandGroup heading="Create New">
                        <CommandItem
                          value={`create-${searchValue.trim()}`}
                          disabled={createDimensionMutation.isPending}
                          onSelect={() => {
                            void handleCreateDimension();
                          }}
                        >
                          {createDimensionMutation.isPending ? (
                            <LoaderCircle className="size-4 animate-spin" />
                          ) : (
                            <Plus className="size-4" />
                          )}
                          <span>Create &quot;{searchValue.trim()}&quot;</span>
                        </CommandItem>
                      </CommandGroup>
                    </>
                  ) : null}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {helperMessage ? <p className="text-sm text-destructive">{helperMessage}</p> : null}
      {!helperMessage && unavailableSelectedDimension ? (
        <p className="text-sm text-amber-700">
          The saved code &quot;{unavailableSelectedDimension.code}&quot; is not in the active registry.
          Re-select it or choose a replacement before publishing.
        </p>
      ) : null}
    </div>
  );
}
