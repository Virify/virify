import type { DateValue } from "@internationalized/date";
import type { ViewingStatus } from "~~/shared/types/viewing";

export const VIEWING_TIME_OPTIONS = [
  "Mornings",
  "Afternoons",
  "Evenings",
  "Any time",
  "Other...",
];

export const TIME_RANGE_DEFAULTS: Record<string, { label: string; time: string }> = {
  Mornings: { label: "Morning (8am–12pm)", time: "09:00" },
  Afternoons: { label: "Afternoon (12pm–5pm)", time: "13:00" },
  Evenings: { label: "Evening (5pm–9pm)", time: "18:00" },
};

export const VIEWING_STATUS_COLOR: Record<
  ViewingStatus,
  "success" | "error" | "warning" | "neutral" | "info"
> = {
  PENDING: "warning",
  ACCEPTED: "success",
  REJECTED: "error",
  RESCHEDULED: "info",
  CANCELLED: "error",
};

export const VIEWING_STATUS_LABEL: Record<ViewingStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Confirmed",
  REJECTED: "Declined",
  RESCHEDULED: "Time proposed",
  CANCELLED: "Cancelled",
};

/** Format ISO date as short display badge (e.g. "Mon 23 Apr") */
export function formatProposedDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** Format ISO date as medium date string (e.g. "23 Apr 2026") */
export function formatViewingDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { dateStyle: "medium" });
}

/** Format ISO date as medium date + short time (e.g. "Mon 23 Apr 2026, 14:00") */
export function formatViewingDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Parse ISO date strings to a Set of YYYY-MM-DD strings (using UTC date to avoid timezone offset) */
export function getAllowedDateStrings(proposedDates: string[]): Set<string> {
  return new Set(
    proposedDates.map((iso) => {
      const d = new Date(iso);
      return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    }),
  );
}

/** Returns true for any date NOT in the allowed set — for use with UCalendar :is-date-unavailable */
export function isViewingDateUnavailable(date: DateValue, allowed: Set<string>): boolean {
  if (!allowed.size) return false;
  return !allowed.has(date.toString());
}

/** Build quick-pick time buttons from preferred time preferences */
export function getTimeRangeButtons(
  preferredTimes: string[],
): { label: string; time: string }[] {
  return preferredTimes
    .filter((t) => t in TIME_RANGE_DEFAULTS)
    .map((t) => TIME_RANGE_DEFAULTS[t]!);
}

/** Resolve final time values, substituting "Other..." with the freeform text */
export function resolveFinalTimes(selected: string[], otherTime: string): string[] {
  return selected
    .map((t) => (t === "Other..." ? otherTime.trim() || "Other" : t))
    .filter(Boolean);
}
