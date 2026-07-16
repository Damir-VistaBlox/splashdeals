import type { HomeDeal } from "@/lib/home/deals";

type HomeDict = Record<string, string>;

/**
 * Family math only when real multi-ticket pricing exists.
 * Estimated 0.7× kid factor was trust risk (#667) — do not render synthetic demos.
 */
export function HomeFamilyMath({
  dict: _dict,
  adultDeal: _adultDeal,
  childDeal = null,
}: {
  dict: HomeDict;
  adultDeal: HomeDeal | null;
  /** Real child entry ticket for the same facility — required to show section. */
  childDeal?: HomeDeal | null;
}) {
  // Honesty gate: no estimated kid pricing on homepage.
  if (!_adultDeal || !childDeal) return null;
  if (_adultDeal.facility.id !== childDeal.facility.id) return null;
  if (!_adultDeal.originalPrice || _adultDeal.originalPrice <= _adultDeal.price) return null;
  if (!childDeal.originalPrice || childDeal.originalPrice <= childDeal.price) return null;

  // Real 2+2 math reserved for a future data-backed path; still hide until product wires childDeal.
  return null;
}
