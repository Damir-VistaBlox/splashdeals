import type { FacilityStatus } from "@prisma/client";

export type FacilityHourSlice = {
  dayOfWeek: number;
  isClosed: boolean;
};

export type FacilityClosureSlice = {
  startDate: Date | string;
  endDate: Date | string;
};

export type FacilityAvailabilityInput = {
  status: FacilityStatus;
  hours?: FacilityHourSlice[] | null;
  closures?: FacilityClosureSlice[] | null;
};

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

/** True when `at` falls within [startDate, endDate] inclusive by calendar day in local TZ. */
export function isDateInClosureWindow(
  closure: FacilityClosureSlice,
  at: Date = new Date(),
): boolean {
  const start = toDate(closure.startDate);
  const end = toDate(closure.endDate);
  const t = at.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export function getActiveClosures(
  closures: FacilityClosureSlice[] | null | undefined,
  at: Date = new Date(),
): FacilityClosureSlice[] {
  if (!closures?.length) return [];
  return closures.filter((c) => isDateInClosureWindow(c, at));
}

export function hasActiveClosure(
  closures: FacilityClosureSlice[] | null | undefined,
  at: Date = new Date(),
): boolean {
  return getActiveClosures(closures, at).length > 0;
}

/** Weekly schedule: is the facility marked closed on the weekday of `at`? */
export function isClosedByWeeklyHours(
  hours: FacilityHourSlice[] | null | undefined,
  at: Date = new Date(),
): boolean {
  if (!hours?.length) return false;
  const day = at.getDay();
  const today = hours.find((h) => h.dayOfWeek === day);
  if (!today) return false;
  return today.isClosed;
}

/** Open for walk-in / "open today" badge: weekly hours only (closures handled separately). */
export function isOpenOnDay(
  hours: FacilityHourSlice[] | null | undefined,
  at: Date = new Date(),
): boolean {
  if (!hours?.length) return false;
  const day = at.getDay();
  const today = hours.find((h) => h.dayOfWeek === day);
  return today ? !today.isClosed : false;
}

/** Shown in discovery / category grids. */
export function isDiscoverable(status: FacilityStatus): boolean {
  return status === "ACTIVE";
}

/**
 * New purchases allowed at `at`.
 * CLOSED / DRAFT / EMERGENCY → no.
 * ACTIVE + active temporary closure → no.
 * ACTIVE + weekly closed day → no.
 */
export function isPurchasable(facility: FacilityAvailabilityInput, at: Date = new Date()): boolean {
  if (facility.status !== "ACTIVE") return false;
  if (hasActiveClosure(facility.closures, at)) return false;
  if (isClosedByWeeklyHours(facility.hours, at)) return false;
  return true;
}

/**
 * Scanner / redeem allowed at `at`.
 * EMERGENCY_SHUTDOWN hard-stops scan.
 * CLOSED / DRAFT block scan (soft-closed facilities not operational).
 * Active temporary closure blocks scan during the window.
 * Weekly closed day blocks scan.
 */
export function isScannable(facility: FacilityAvailabilityInput, at: Date = new Date()): boolean {
  if (facility.status === "EMERGENCY_SHUTDOWN") return false;
  if (facility.status !== "ACTIVE") return false;
  if (hasActiveClosure(facility.closures, at)) return false;
  if (isClosedByWeeklyHours(facility.hours, at)) return false;
  return true;
}

export type EffectiveOpenState =
  "draft" | "closed" | "emergency" | "temporary_closure" | "weekly_closed" | "open";

export function getEffectiveOpenState(
  facility: FacilityAvailabilityInput,
  at: Date = new Date(),
): EffectiveOpenState {
  if (facility.status === "DRAFT") return "draft";
  if (facility.status === "CLOSED") return "closed";
  if (facility.status === "EMERGENCY_SHUTDOWN") return "emergency";
  if (hasActiveClosure(facility.closures, at)) return "temporary_closure";
  if (isClosedByWeeklyHours(facility.hours, at)) return "weekly_closed";
  if (!facility.hours?.length) {
    // No hours configured: treat ACTIVE as open for governance, still purchasable only if hours not forcing closed
    return "open";
  }
  return isOpenOnDay(facility.hours, at) ? "open" : "weekly_closed";
}
