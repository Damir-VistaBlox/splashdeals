import { prisma } from "@/lib/prisma"
import { cacheLife } from "next/cache"

/**
 * 🏙️ Cached Active Cities
 * Returns regions with live inventory. Optimized for high-traffic discovery.
 */
export async function getActiveCities() {
  'use cache'
  cacheLife('hours') // Cities change infrequently
  
  return prisma.city.findMany({
    where: {
      facilities: {
        some: {} 
      }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: { facilities: true }
      }
    },
    orderBy: {
      name: "asc"
    }
  });
}

/**
 * 🏷️ Cached Categories
 * Aggregates categories from all facilities.
 */
export async function getDiscoveryCategories() {
  'use cache'
  cacheLife('hours')
  
  return prisma.facility.groupBy({
    by: ['category'],
    _count: { id: true }
  });
}
