import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Facility Not Found | Splashdeals Admin",
  description: "The requested facility does not exist or has been removed.",
};

export default function FacilityNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="text-primary/40 text-6xl font-bold">404</div>
      <h2 className="text-primary text-xl font-semibold">Facility Not Found</h2>
      <p className="text-muted-foreground max-w-md text-center text-sm">
        The facility you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <div className="mt-2 flex gap-3">
        <Button asChild variant="default">
          <Link href="/admin/facilities">Back to Facilities</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
