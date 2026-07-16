import { describe, expect, it } from "vitest";
import { homeDealScore } from "@/lib/home/deal-score";
import type { HomeDeal } from "@/lib/home/deals-types";

function deal(
  partial: Partial<HomeDeal> & Pick<HomeDeal, "title" | "price" | "absoluteSave">,
): HomeDeal {
  return {
    id: partial.id || "1",
    title: partial.title,
    price: partial.price,
    originalPrice: partial.originalPrice ?? partial.price + partial.absoluteSave,
    currency: "RSD",
    discountPercent: partial.discountPercent ?? 20,
    absoluteSave: partial.absoluteSave,
    pitch: "pitch",
    imageUrl: partial.imageUrl === undefined ? "https://example.com/x.jpg" : partial.imageUrl,
    validityType: "FLEXIBLE_30_DAY",
    requiresIdentity: false,
    requiresPhoto: false,
    minPeople: 1,
    maxPeople: null,
    facility: {
      id: partial.facility?.id || "f1",
      name: partial.facility?.name || "Park",
      slug: partial.facility?.slug || "park",
      category: partial.facility?.category ?? "Akva Park",
      city: partial.facility?.city ?? "Beograd",
      openToday: true,
    },
  };
}

describe("homeDealScore", () => {
  it("prefers absolute RSD save over high % on cheap tickets", () => {
    const kidsPool = deal({
      title: "Deca",
      price: 100,
      absoluteSave: 200,
      discountPercent: 67,
      facility: {
        id: "a",
        name: "Pool",
        slug: "pool",
        category: "Bazeni",
        city: "X",
        openToday: true,
      },
    });
    const aquaAdult = deal({
      title: "Odrasli",
      price: 1000,
      absoluteSave: 400,
      discountPercent: 29,
      facility: {
        id: "b",
        name: "Aqua",
        slug: "aqua",
        category: "Akva Park",
        city: "Y",
        openToday: true,
      },
    });
    expect(homeDealScore(aquaAdult)).toBeGreaterThan(homeDealScore(kidsPool));
  });

  it("penalizes missing media and non-entry titles", () => {
    const withMedia = deal({
      title: "Odrasli ulaz",
      price: 1000,
      absoluteSave: 300,
      imageUrl: "x",
    });
    const noMedia = deal({
      title: "Odrasli ulaz",
      price: 1000,
      absoluteSave: 300,
      imageUrl: null,
    });
    const parking = deal({
      title: "Parking dnevni",
      price: 200,
      absoluteSave: 50,
      imageUrl: "x",
    });
    expect(homeDealScore(withMedia)).toBeGreaterThan(homeDealScore(noMedia));
    expect(homeDealScore(withMedia)).toBeGreaterThan(homeDealScore(parking));
  });
});
