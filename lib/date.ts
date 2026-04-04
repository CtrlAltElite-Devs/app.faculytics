import { format, parseISO } from "date-fns";

/**
 * Formats a date string or Date object into a human-readable date.
 * e.g. "March 22, 2026"
 */
export function formatDate(date: string | Date, pattern = "MMMM d, yyyy"): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return format(parsed, pattern);
}

/**
 * Formats a date string or Date object into a human-readable date with time.
 * e.g. "March 22, 2026 at 3:45 PM"
 */
export function formatDateTime(date: string | Date, pattern = "MMMM d, yyyy 'at' h:mm a"): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return format(parsed, pattern);
}
