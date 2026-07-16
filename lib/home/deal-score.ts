import type { HomeDeal } from "@/lib/home/deals-types";

/** Non-entry extras that should not drive homepage rails. */
export const NON_ENTRY_RE =
  /parkir|parking|ležalj|lezalj|le\s*žalj|garderob|kaucij|depozit|bravar|ormarić|ormaric|locker|towel|peškir|peskir|dodat/i;

/** Prefer public entry-style products in homepage ranking. */
export const ENTRY_HINT_RE =
  /ulaz|odrasl|adult|deca|dete|dete|dijete|child|junior|ceo\s*dan|cjelodnev|pun\s*dan|full.?day|dnevn|regular/i;

export function isLikelyEntryTicket(title: string): boolean {
  if (NON_ENTRY_RE.test(title)) return false;
  return true;
}

export function entryBoost(title: string): number {
  if (NON_ENTRY_RE.test(title)) return -500;
  if (ENTRY_HINT_RE.test(title)) return 120;
  return 0;
}

export function categoryBoost(category: string | null): number {
  const c = (category || "").toLowerCase();
  if (c.includes("akva") || c.includes("aqua") || c.includes("water")) return 180;
  if (c.includes("banj") || c.includes("spa") || c.includes("wellness")) return 80;
  if (c.includes("bazen") || c.includes("pool")) return 40;
  return 0;
}

/** Ranking score: absolute RSD save + aqua/entry weight + media. */
export function homeDealScore(
  deal: Pick<HomeDeal, "title" | "absoluteSave" | "discountPercent" | "imageUrl" | "facility">,
): number {
  return (
    deal.absoluteSave +
    entryBoost(deal.title) +
    categoryBoost(deal.facility.category) +
    (deal.imageUrl ? 80 : -200) +
    Math.min(deal.discountPercent, 40)
  );
}
