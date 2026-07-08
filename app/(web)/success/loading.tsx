import { SuccessSkeleton } from "./_components/SuccessSkeleton";

export default function SuccessLoading() {
  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-4xl">
        <SuccessSkeleton />
      </div>
    </div>
  );
}
