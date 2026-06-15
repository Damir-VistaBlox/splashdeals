import { FacilitySchemaInput } from "./types";

export function buildAttractionSchema(facility: FacilitySchemaInput, facilitySlug: string, operatingHours: any[]) {
  return {
    "@type": ["AmusementPark", "TouristAttraction"],
    "@id": `https://www.splashdeals.rs/${facilitySlug}#attraction`,
    name: facility.name,
    description: facility.description?.slice(0, 300),
    url: `https://www.splashdeals.rs/${facilitySlug}`,
    image: facility.media?.[0]?.url || undefined,
    isAccessibleForFree: false,
    publicAccess: true,
    availableLanguage: ["sr"],
    address: {
      "@type": "PostalAddress",
      streetAddress: `${facility.streetName} ${facility.streetNumber}`,
      addressLocality: facility.city,
      postalCode: facility.postalCode,
      addressCountry: "RS",
    },
    ...(facility.lat && facility.lng ? {
      geo: {
        "@type": "GeoCoordinates",
        latitude: Number(facility.lat),
        longitude: Number(facility.lng),
      }
    } : {}),
    ...(operatingHours.length > 0 ? {
      openingHoursSpecification: operatingHours
    } : {}),
  };
}
