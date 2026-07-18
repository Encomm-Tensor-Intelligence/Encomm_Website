"use client";

import { type ReactNode, useId } from "react";
import { cn } from "@/lib/cn";

type BaseProps = {
  label: string;
  error?: string | null;
  required?: boolean;
  hint?: string;
  className?: string;
  children: (props: {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
    required: boolean;
  }) => ReactNode;
};

/**
 * Field — accessible form field wrapper. Associates label, hint, and error
 * with the control via aria-describedby / aria-invalid.
 */
export function Field({
  label,
  error,
  required,
  hint,
  className,
  children,
}: BaseProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="text-[13px] font-medium text-ink"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-violet">
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="text-[11.5px] text-faint">
          {hint}
        </p>
      ) : null}
      {children({
        id,
        describedBy,
        invalid: Boolean(error),
        required: Boolean(required),
      })}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-[12px] text-[#c0392b]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const fieldStyles =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[14.5px] text-ink placeholder:text-faint outline-none transition-all duration-200 focus:border-violet focus:ring-2 focus:ring-violet/15";
export const fieldErrorStyles =
  "border-[#c0392b]/40 focus:border-[#c0392b] focus:ring-[#c0392b]/15";
