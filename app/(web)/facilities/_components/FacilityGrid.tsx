import { prisma } from "@/server/lib/prisma";
import { FacilityCard } from "./FacilityCard";
import * as motion from "framer-motion/client";

interface FacilityGridProps {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: Record<string, any>;
  fromLabel: string;
  category?: string;
  citySlug?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  noFacilitiesLabel?: string;
}

/**
 * 🚀 FacilityGrid Interface (Hardened Edition)
 * Asynchronous data provider for marketplace discovery with dynamic filtering.
 * Applies multi-dimensional filters and sorting directly in the discovery engine.
 */
export async function FacilityGrid({ dict,
  fromLabel, 
  category,
  citySlug,
  minPrice,
  maxPrice,
  sort = "newest",
  noFacilitiesLabel 
}: FacilityGridProps) {
  
  // 1. Build Query
  const facilities = await prisma.facility.findMany({
    where: {
      ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
      ...(citySlug ? {
        marketplaceCities: {
          some: {
            city: {
              slug: citySlug
            }
          }
        }
      } : {}),
      ...(minPrice || maxPrice ? {
        tickets: {
          some: {
            isActive: true,
            ...(minPrice ? { price: { gte: parseFloat(minPrice) } } : {}),
            ...(maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {}),
          }
        }
      } : {})
    },
    include: {
      media: {
        orderBy: { order: "asc" }
      },
      tickets: {
        where: { isActive: true },
        orderBy: { price: 'asc' },
      }
    },
    orderBy: sort === 'name_asc' ? { name: 'asc' } : { createdAt: 'desc' }
  });

  // 2. Client-side Sort Logic (for complex fields like price)
  const processedFacilities = [...facilities];
  
  if (sort === 'price_asc' || sort === 'price_desc') {
    processedFacilities.sort((a, b) => {
      const priceA = a.tickets[0] ? Number(a.tickets[0].price) : Infinity;
      const priceB = b.tickets[0] ? Number(b.tickets[0].price) : Infinity;
      
      return sort === 'price_asc' ? priceA - priceB : priceB - priceA;
    });
  }

  if (processedFacilities.length === 0 && noFacilitiesLabel) {
    return (
      <div className="text-center py-24 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-white/10">
             <span className="text-2xl">🌊</span>
          </div>
          <span className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">
            {noFacilitiesLabel}
          </span>
          <span className="text-slate-600 text-[10px] uppercase font-bold tracking-widest max-w-xs leading-relaxed">
            {dict?.facilities?.no_results_hint || "Pokušajte da prilagodite filtere ili istražite druge kategorije."}
          </span>
        </motion.div>
      </div>
    );
  }

  // 3. Serialize Prisma Decimal → number for client component props
  const serializedFacilities = processedFacilities.map((f) => ({
    ...f,
    tickets: f.tickets.map((t) => ({
      ...t,
      price: Number(t.price),
    })),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {serializedFacilities.map((facility, idx) => (
        <motion.div
          key={facility.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: idx * 0.05,
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          <FacilityCard 
            facility={facility} 
            dict={dict}
            fromLabel={fromLabel}
            isPriority={idx < 10}
          />
        </motion.div>
      ))}
    </div>
  );
}
