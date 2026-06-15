import { SuccessSkeleton } from "./_components/SuccessSkeleton"

export default function SuccessLoading() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 md:p-12">
      <div className="max-w-4xl w-full">
        <SuccessSkeleton />
      </div>
    </div>
  )
}
