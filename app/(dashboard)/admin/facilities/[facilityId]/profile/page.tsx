import { FacilityProfileForm } from "../_components/facility-profile-form"
import { prisma } from "@/server/lib/prisma"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import { auth } from "@/server/lib/auth"
import { headers } from "next/headers"

export default async function ProfilePage({ params }: { params: Promise<{ facilityId: string }> }) {
  const { facilityId } = await params
  await connection()
  
  const [facility, availableCities, transactionCount, session] = await Promise.all([
    prisma.facility.findUnique({
      where: { id: facilityId },
      include: { 
        hours: { orderBy: { dayOfWeek: "asc" } },
        marketplaceCities: true,
        closures: { orderBy: { startDate: "asc" } }
      }
    }),
    prisma.city.findMany({
      orderBy: { name: "asc" }
    }),
    prisma.transaction.count({
      where: { facilityId }
    }),
    auth.api.getSession({
      headers: await headers(),
    })
  ])
  
  if (!facility) notFound()
  
  const userRole = session?.user?.role || "GUEST"
  
  return (
    <FacilityProfileForm 
      facility={facility} 
      availableCities={availableCities} 
      userRole={userRole}
      transactionCount={transactionCount}
    />
  )
}
