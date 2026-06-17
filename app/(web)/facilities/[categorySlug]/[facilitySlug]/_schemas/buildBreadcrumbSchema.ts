import { FacilitySchemaInput } from "./types";

export function buildBreadcrumbSchema(facility: FacilitySchemaInput, facilitySlug: string, categorySlug: string, categoryLabel: string) {
  // Normalize category slug: "Waterpark" → "waterpark", "Swimming Pool" → "swimming-pool"
  const normalizedCategorySlug = categorySlug.toLowerCase().replace(/\s+/g, '-');
  
  return {
    "@type": "BreadcrumbList",
    "@id": `https://www.splashdeals.rs/${facilitySlug}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.splashdeals.rs",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryLabel,
        item: `https://www.splashdeals.rs/${normalizedCategorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: facility.name,
        item: `https://www.splashdeals.rs/${facilitySlug}`,
      },
    ],
  };
}
