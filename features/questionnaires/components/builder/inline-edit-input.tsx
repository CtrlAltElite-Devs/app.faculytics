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
          "block h-9 w-full max-w-full min-w-0 overflow-hidden whitespace-nowrap rounded-md border border-input bg-muted/60 px-3 py-1 font-sans text-base shadow-xs outline-none transition-[color,box-shadow,background-color] placeholder:text-muted-foreground md:text-sm",
          "focus-visible:border-ring focus-visible:bg-background focus-visible:ring-[3px] focus-visible:ring-ring/20",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
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
        "block h-9 w-full max-w-full min-w-0 overflow-hidden whitespace-nowrap rounded-md border border-input bg-muted/50 px-3 py-1 text-left text-clip font-playfair shadow-xs transition-[color,box-shadow,background-color,border-color] hover:border-ring/40 hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20",
        !value && "text-muted-foreground",
        ariaInvalid && "border-destructive/60 text-destructive",
        textClassName
      )}
      onClick={() => setIsEditing(true)}
    >
      {value || placeholder || emptyLabel}
    </button>
  );
}
