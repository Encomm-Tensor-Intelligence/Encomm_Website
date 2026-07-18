import { clsx, type ClassValue } from "clsx";

/** Conditional classnames helper. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export type { ClassValue };
