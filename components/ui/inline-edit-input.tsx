"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type InlineEditInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
  ariaInvalid?: boolean;
  textClassName?: string;
  inputClassName?: string;
};

export function InlineEditInput({
  id,
  value,
  onChange,
  placeholder,
  emptyLabel = "Click to edit",
  disabled = false,
  ariaInvalid = false,
  textClassName,
  inputClassName,
}: InlineEditInputProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isEditing) {
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  if (isEditing && !disabled) {
    return (
      <input
        ref={inputRef}
        id={id}
        value={value}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        data-slot="inline-edit-input"
        className={cn(
          "h-9 w-full min-w-0 truncate whitespace-nowrap rounded-none border-0 border-b border-input bg-transparent px-3 py-1 font-sans text-base shadow-none outline-none transition-[color,box-shadow] placeholder:text-muted-foreground md:text-sm",
          "focus-visible:border-b-ring",
          "aria-invalid:border-destructive",
          inputClassName
        )}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => setIsEditing(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === "Escape") {
            setIsEditing(false);
          }
        }}
      />
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "h-9 w-full min-w-0 truncate whitespace-nowrap rounded-md bg-muted/20 px-3 py-1 text-left font-playfair transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        !value && "text-muted-foreground",
        ariaInvalid && "text-destructive",
        textClassName
      )}
      onClick={() => setIsEditing(true)}
    >
      {value || placeholder || emptyLabel}
    </button>
  );
}
