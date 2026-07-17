/**
 * Cross-surface guest claim conflict handoff.
 * CartStateBootstrap may detect a facility conflict before /cart mounts;
 * CartClient reads this and shows GuestCartConflictModal (no silent drop).
 */

export type GuestClaimConflictPayload = {
  guestFacilityName: string;
  userFacilityName: string;
};

const conflictKey = (userId: string) => `sd_guest_claim_conflict:${userId}`;
export const GUEST_CLAIM_CONFLICT_EVENT = "sd:guest-cart-conflict";

export function storeGuestClaimConflict(userId: string, payload: GuestClaimConflictPayload): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(conflictKey(userId), JSON.stringify(payload));
    window.dispatchEvent(
      new CustomEvent(GUEST_CLAIM_CONFLICT_EVENT, { detail: { userId, ...payload } }),
    );
  } catch {
    // sessionStorage may be unavailable
  }
}

export function readGuestClaimConflict(userId: string): GuestClaimConflictPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(conflictKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GuestClaimConflictPayload;
    if (!parsed?.guestFacilityName || !parsed?.userFacilityName) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearGuestClaimConflict(userId: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(conflictKey(userId));
  } catch {
    // ignore
  }
}

export function markGuestClaimHandled(userId: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`sd_guest_claim:${userId}`, "1");
  } catch {
    // ignore
  }
}

export function isGuestClaimHandled(userId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(`sd_guest_claim:${userId}`) === "1";
  } catch {
    return false;
  }
}
