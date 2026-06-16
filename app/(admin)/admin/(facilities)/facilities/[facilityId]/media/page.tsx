import { Metadata } from "next"
import { MediaGallery } from "../_components/media/media-gallery"
import { prisma } from "@/server/lib/prisma"
import { connection } from "next/server"
import { MediaPurpose } from "@prisma/client"

export const metadata: Metadata = {
  title: "Media Assets | Splashdeals Admin",
  description: "Manage facility gallery, photos, and video branding.",
}

export default async function MediaPage({ params }: { params: Promise<{ facilityId: string }> }) {
  const { facilityId } = await params
  await connection()
  const facility = await prisma.facility.findUnique({
    where: { id: facilityId },
    select: { media: true }
  })
  
  // 🛡️ Filter out any ticket-specific images from the general facility media gallery
  const filteredMedia = (facility?.media || []).filter(
    (item) => item.purpose !== MediaPurpose.TICKET
  )
  
  return <MediaGallery facilityId={facilityId} initialMedia={filteredMedia} />
}
