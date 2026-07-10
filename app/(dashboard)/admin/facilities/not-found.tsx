import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Splashdeals Admin",
  description: "The requested facilities page does not exist.",
};

export default function FacilitiesNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="text-primary/40 text-6xl font-bold">404</div>
      <h2 className="text-primary text-xl font-semibold">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md text-center text-sm">
        The page you&apos;re looking for doesn&apos;t exist within the facilities section.
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
