import { FacilitySchemaInput } from "./types";

export function buildProductSchema(
  facility: FacilitySchemaInput, 
  facilitySlug: string, 
  aggregateOffer: any, 
  ticketCount: number, 
  additionalType: string
  // ratingValue and reviewCount removed: AggregateRating requires real user reviews.
  // Using computed/fake values violates Google's structured data policy and risks penalties.
) {
  if (!aggregateOffer) return null;
  
  return {
    "@type": "Product",
    "@id": `https://www.splashdeals.rs/${facilitySlug}#product`,
    name: `${facility.name} - Digital Tickets`,
    description: `Kupi digitalne ulaznice za ${facility.name} na Splashdeals. Brza digitalna isporuka, podrška za Apple & Google Wallet. ${ticketCount} vrsta ulaznica u ponudi.`,
    image: facility.media?.[0]?.url || undefined,
    sku: `SD-FAC-${facility.slug.toUpperCase()}`,
    mpn: `SD-MPN-${facility.slug.toUpperCase()}`,
    additionalType: additionalType,
    brand: {
      "@type": "Brand",
      name: facility.name,
    },
    offers: aggregateOffer,
    category: facility.category,
  };
}
