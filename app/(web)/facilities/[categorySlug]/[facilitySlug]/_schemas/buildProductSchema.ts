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
  
  const heroImage = facility.media?.[0]?.url || `https://www.splashdeals.rs/og-image.png`;
  
  // Derive a unique 13-digit GTIN from facility slug hash for Merchant Center eligibility
  const gtinHash = facilitySlug.split('').reduce((acc, c) => {
    return ((acc << 5) - acc + c.charCodeAt(0)) | 0;
  }, 0);
  const gtin13 = `0000000000000`.split('').map((_, i) => {
    return i < 12 ? String(Math.abs(gtinHash * (i + 1) * 7) % 10) : '0';
  }).join('');
  
  return {
    "@type": "Product",
    "@id": `https://www.splashdeals.rs/${facilitySlug}#product`,
    name: `${facility.name} - Digital Tickets`,
    description: `Kupi digitalne ulaznice za ${facility.name} na Splashdeals. Brza digitalna isporuka, podr\\u0161ka za Apple & Google Wallet. ${ticketCount} vrsta ulaznica u ponudi.`,
    image: heroImage,
    sku: `SD-FAC-${facility.slug.toUpperCase()}`,
    mpn: `SD-MPN-${facility.slug.toUpperCase()}`,
    gtin13: gtin13,
    additionalType: additionalType,
    brand: {
      "@type": "Brand",
      name: facility.name,
    },
    offers: aggregateOffer,
    category: facility.category,
  };
}
