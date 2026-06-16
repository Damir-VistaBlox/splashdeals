import { Skeleton } from "@/components/ui/skeleton"

export default function ForbiddenLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-background">
      <div className="space-y-6 flex flex-col items-center">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
    </div>
  )
}
