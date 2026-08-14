import { Skeleton } from "@/components/ui/skeleton";

/** Brief shell while /checkout redirects to /cart. */
export default function CheckoutLoading() {
  return (
    <div className="mobile-route-frame">
      <div className="mx-auto flex min-h-[48vh] max-w-7xl items-center justify-center px-4 pt-6 sm:pt-8">
        <div className="bg-card/70 border-border w-full max-w-sm space-y-4 rounded-[1.75rem] border p-5 shadow-sm backdrop-blur-sm">
          <Skeleton className="bg-muted mx-auto h-3 w-28 rounded-full" />
          <Skeleton className="bg-muted mx-auto h-6 w-40 rounded-lg" />
          <Skeleton className="bg-muted h-24 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
