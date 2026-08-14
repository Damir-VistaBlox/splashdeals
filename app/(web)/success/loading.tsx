import { SuccessSkeleton } from "./_components/SuccessSkeleton";

export default function SuccessLoading() {
  return (
    <div className="mobile-route-frame bg-background text-foreground flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-12">
      <div className="w-full max-w-4xl">
        <SuccessSkeleton />
      </div>
    </div>
  );
}
