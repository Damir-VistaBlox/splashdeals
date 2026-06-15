import { FacilitySchemaInput } from "./types";

export function buildBusinessSchema(facility: FacilitySchemaInput, facilitySlug: string, hasAggregateOffer: boolean) {
  return {
    "@type": "EntertainmentBusiness",
    "@id": `https://www.splashdeals.rs/${facilitySlug}#business`,
    name: facility.name,
    url: `https://www.splashdeals.rs/${facilitySlug}`,
    image: facility.media?.[0]?.url || undefined,
    priceRange: hasAggregateOffer ? "RSD" : undefined,
    ...(facility.publicPhone ? { telephone: facility.publicPhone } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${facility.streetName} ${facility.streetNumber}`,
      addressLocality: facility.city,
      postalCode: facility.postalCode,
      addressCountry: "RS",
    },
    containsPlace: {
      "@id": `https://www.splashdeals.rs/${facilitySlug}#attraction`
    },
  };
}
