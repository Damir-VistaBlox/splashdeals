import { redirect } from "next/navigation";
import { FacilityCity, City } from "@prisma/client";

/**
 * 🕵️ Discovery Validator
 * Ensures the URL discovery slug (category or city) matches the actual facility data.
 * Prevents duplicate content and enforces SEO canonical paths.
 */
export function validateDiscoverySlug(
  currentSlug: string,
  facility: { 
    category: string, 
    slug: string, 
    marketplaceCities?: (FacilityCity & { city: City })[] 
  },
  basePath: string = "/facilities"
) {
  const canonicalCategory = facility.category.toLowerCase().replace(/\s+/g, '-');
  const citySlugs = facility.marketplaceCities?.map((mc) => mc.city.slug) || [];
  
  const currentSlugLower = currentSlug.toLowerCase();
  const isValid = currentSlugLower === canonicalCategory || citySlugs.includes(currentSlugLower);

  if (!isValid) {
    // Redirect to the canonical category-based URL
    redirect(`${basePath}/${canonicalCategory}/${facility.slug}`);
  }

  return {
    isCategory: currentSlugLower === canonicalCategory,
    isCity: citySlugs.includes(currentSlugLower),
    canonicalPath: `/${facility.slug}`
  };
}
