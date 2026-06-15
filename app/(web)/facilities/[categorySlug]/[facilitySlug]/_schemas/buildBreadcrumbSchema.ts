import { FacilitySchemaInput } from "./types";

export function buildBreadcrumbSchema(facility: FacilitySchemaInput, facilitySlug: string, categorySlug: string, categoryLabel: string) {
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
        item: `https://www.splashdeals.rs/${categorySlug}`,
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
