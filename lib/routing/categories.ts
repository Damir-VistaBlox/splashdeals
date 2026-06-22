/**
 * 🗂️ Splashdeals Category Registry
 * Single source of truth for all facility categories.
 * Maps URL slugs → display names → database values.
 */
export const CATEGORIES = {
  "akva-parkovi": {
    name: "Akva Parkovi",
    dbValue: "Akva Park",
  },
  "bazeni": {
    name: "Bazeni",
    dbValue: "Bazen",
  },
  "wellness-i-spa": {
    name: "Wellness i Spa",
    dbValue: "Wellness i Spa",
  },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;

/**
 * Convert a URL slug to the DB category value for querying.
 * E.g. "akva-parkovi" → "Akva Park"
 */
export function slugToDbValue(slug: string): string | undefined {
  return CATEGORIES[slug as CategorySlug]?.dbValue;
}

/**
 * Convert a URL slug to the human-readable display name.
 * E.g. "akva-parkovi" → "Akva Parkovi"
 */
export function slugToName(slug: string): string | undefined {
  return CATEGORIES[slug as CategorySlug]?.name;
}

/**
 * Convert a DB category value back to the URL slug.
 * E.g. "Akva Park" → "akva-parkovi"
 */
export function dbValueToSlug(dbValue: string): string | undefined {
  const entry = Object.entries(CATEGORIES).find(
    ([, v]) => v.dbValue.toLowerCase() === dbValue.toLowerCase()
  );
  return entry?.[0];
}

/**
 * Check if a slug is a known category.
 */
export function isKnownCategory(slug: string): boolean {
  return slug in CATEGORIES;
}

/**
 * Get all known category slugs.
 */
export function getAllSlugs(): CategorySlug[] {
  return Object.keys(CATEGORIES) as CategorySlug[];
}
