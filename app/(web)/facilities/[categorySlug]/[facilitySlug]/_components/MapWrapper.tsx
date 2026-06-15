"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const DynamicMap = dynamic(
  () => import("./FacilityMap").then((mod) => mod.FacilityMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] rounded-[2.5rem] bg-white/5" />,
  }
);

interface MapWrapperProps {
  lat: number;
  lng: number;
  facilityName: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
}

/**
 * 🗺️ MapWrapper Component (Client Component)
 * Dynamically loads the Leaflet map with ssr: false on the client side,
 * preventing SSR compilation errors in Next.js Server Components.
 */
export function MapWrapper(props: MapWrapperProps) {
  return <DynamicMap {...props} />;
}
