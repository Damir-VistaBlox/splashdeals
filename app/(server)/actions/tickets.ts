"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { put } from "@vercel/blob"
import { processTicketImage } from "@/lib/media"
import { 
  upsertTicketSchema, 
  type UpsertTicketValues,
  ticketGroupSchema,
  type TicketGroupValues,
  groupTicketSchema,
  type TicketTierValues,
  reorderSchema,
  type ReorderValues,
  slugSchema
} from "@/lib/validations/ticket"
import { validateFacilityAccess } from "@/lib/auth-guards"
import { handleServerActionError } from "@/lib/server-action-error"
import { withFacilityAccess } from "@/lib/with-facility-access"

/**
 * 🌊 High-Density Ticket Upload Action
 */
export async function uploadTicketImageAction(formData: FormData) {
  const facilityId = formData.get("facilityId") as string;
  const file = formData.get("file") as File;

  if (!facilityId || !file) {
    return { success: false, error: "Missing facility ID or file" };
  }

  try {
    await validateFacilityAccess(facilityId)
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const processedBuffer = await processTicketImage(buffer);
    const filename = `facilities/${facilityId}/tickets/${Date.now()}-${file.name.split('.')[0]}.webp`;
    
    const blob = await put(filename, processedBuffer, {
      access: "public",
      contentType: "image/webp",
    });

    return { success: true, url: blob.url };
  } catch (error) {
    return handleServerActionError(error)
  }
}

export const upsertTicketAction = withFacilityAccess(async (data: UpsertTicketValues) => {
  try {
    const validatedFields = upsertTicketSchema.parse(data)
    
    const saleStart = validatedFields.saleStart ? new Date(validatedFields.saleStart) : null
    const saleEnd = validatedFields.saleEnd ? new Date(validatedFields.saleEnd) : null

    if (validatedFields.id) {
      await prisma.ticket.update({
        where: { id: validatedFields.id },
        data: {
          title: validatedFields.title,
          type: validatedFields.type,
          price: validatedFields.price,
          originalPrice: validatedFields.originalPrice,
          currency: validatedFields.currency,
          validityType: validatedFields.validityType,
          isActive: validatedFields.isActive,
          isFeatured: validatedFields.isFeatured,
          displayOrder: validatedFields.displayOrder,
          saleStart,
          saleEnd,
          description: validatedFields.description,
          descriptionSr: validatedFields.descriptionSr,
          titleSr: validatedFields.titleSr,
          imageUrl: validatedFields.imageUrl,
          finePrint: validatedFields.finePrint,
          requiresIdentity: validatedFields.requiresIdentity,
          requiresPhoto: validatedFields.requiresPhoto,
          groupId: validatedFields.groupId,
          dayType: validatedFields.dayType,
          timeSlot: validatedFields.timeSlot,
          isSeasonPass: validatedFields.isSeasonPass,
          minPeople: validatedFields.minPeople,
          maxPeople: validatedFields.maxPeople,
          slug: validatedFields.slug && validatedFields.slug.trim() !== "" ? validatedFields.slug.trim() : null,
        },
      })
    } else {
      await prisma.ticket.create({
        data: {
          facilityId: validatedFields.facilityId,
          title: validatedFields.title,
          type: validatedFields.type,
          price: validatedFields.price,
          originalPrice: validatedFields.originalPrice,
          currency: validatedFields.currency,
          validityType: validatedFields.validityType,
          isActive: validatedFields.isActive,
          isFeatured: validatedFields.isFeatured,
          displayOrder: validatedFields.displayOrder,
          saleStart,
          saleEnd,
          description: validatedFields.description,
          descriptionSr: validatedFields.descriptionSr,
          titleSr: validatedFields.titleSr,
          imageUrl: validatedFields.imageUrl,
          finePrint: validatedFields.finePrint,
          requiresIdentity: validatedFields.requiresIdentity,
          requiresPhoto: validatedFields.requiresPhoto,
          groupId: validatedFields.groupId,
          dayType: validatedFields.dayType,
          timeSlot: validatedFields.timeSlot,
          isSeasonPass: validatedFields.isSeasonPass,
          minPeople: validatedFields.minPeople,
          maxPeople: validatedFields.maxPeople,
          slug: validatedFields.slug && validatedFields.slug.trim() !== "" ? validatedFields.slug.trim() : null,
        },
      })
    }

    revalidatePath(`/admin/facilities/${validatedFields.facilityId}`)
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
})

export async function deleteTicketAction(ticketId: string, facilityId: string) {
  try {
    await validateFacilityAccess(facilityId)
    await prisma.ticket.delete({
      where: { id: ticketId },
    })
    revalidatePath(`/admin/facilities/${facilityId}`)
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function getTicketGroupsAction(facilitySlug: string) {
  try {
    const validated = slugSchema.parse({ slug: facilitySlug })

    const groups = await prisma.ticketGroup.findMany({
      where: { facility: { slug: validated.slug } },
      include: {
        tickets: {
          orderBy: { displayOrder: "asc" },
        },
      },
      orderBy: { displayOrder: "asc" },
    })

    const serialized = groups.map(group => {
      const ticketsMapped = group.tickets.map(ticket => ({
        ...ticket,
        label: ticket.title, // Map title to label for compatibility
        price: Number(ticket.price),
        originalPrice: ticket.originalPrice ? Number(ticket.originalPrice) : null,
      }))
      
      return {
        ...group,
        tickets: ticketsMapped,
        tiers: ticketsMapped, // Backwards-compatible alias
      }
    })

    return { success: true, data: serialized }
  } catch (error) {
    return handleServerActionError(error)
  }
}

export const upsertTicketGroupAction = withFacilityAccess(async (values: TicketGroupValues) => {
  try {
    const validated = ticketGroupSchema.parse(values)
    const { id, tickets, ...data } = validated

    await prisma.$transaction(async (tx) => {
      if (id) {
        // 1. Update the parent TicketGroup
        await tx.ticketGroup.update({
          where: { id },
          data,
        })

        if (tickets) {
          // Get all existing ticket IDs in the database for this group
          const existingTickets = await tx.ticket.findMany({
            where: { groupId: id },
            select: { id: true },
          })
          const existingIds = existingTickets.map((t) => t.id)

          // Identify which incoming tickets to keep/update
          const incomingIds = tickets.map((t) => t.id).filter(Boolean) as string[]

          // Tickets to delete: present in DB but not in the incoming list
          const toDeleteIds = existingIds.filter((dbId) => !incomingIds.includes(dbId))
          if (toDeleteIds.length > 0) {
            await tx.ticket.deleteMany({
              where: {
                id: { in: toDeleteIds },
              },
            })
          }

          // Create or update incoming tickets
          for (const ticket of tickets) {
            const { id: ticketId, label, ...ticketData } = ticket
            const titleValue = ticketData.title || label || "Standard"
            
            if (ticketId) {
              await tx.ticket.update({
                where: { id: ticketId },
                data: {
                  ...ticketData,
                  title: titleValue,
                  groupId: id,
                  facilityId: data.facilityId,
                  type: ticketData.type || "ADULT",
                  validityType: ticketData.validityType || "FIXED_DATE",
                },
              })
            } else {
              await tx.ticket.create({
                data: {
                  ...ticketData,
                  title: titleValue,
                  groupId: id,
                  facilityId: data.facilityId,
                  type: ticketData.type || "ADULT",
                  validityType: ticketData.validityType || "FIXED_DATE",
                },
              })
            }
          }
        }
      } else {
        // Creating a new TicketGroup
        const newGroup = await tx.ticketGroup.create({
          data,
        })

        // Create associated tickets if present
        if (tickets && tickets.length > 0) {
          for (const ticket of tickets) {
            const { id: _, label, ...ticketData } = ticket
            const titleValue = ticketData.title || label || "Standard"
            await tx.ticket.create({
              data: {
                ...ticketData,
                title: titleValue,
                groupId: newGroup.id,
                facilityId: data.facilityId,
                type: ticketData.type || "ADULT",
                validityType: ticketData.validityType || "FIXED_DATE",
              },
            })
          }
        }
      }
    })

    revalidatePath(`/admin/facilities/${data.facilityId}`)
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
})

export async function deleteTicketGroupAction(id: string, facilityId: string) {
  try {
    await validateFacilityAccess(facilityId)
    await prisma.ticketGroup.delete({ where: { id } })
    revalidatePath(`/admin/facilities/${facilityId}`)
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function upsertTicketTierAction(groupId: string, values: TicketTierValues, facilityId: string) {
  try {
    await validateFacilityAccess(facilityId)
    const validated = groupTicketSchema.parse(values)
    const { id, label, ...data } = validated
    const titleValue = data.title || label || "Standard"

    if (id) {
      await prisma.ticket.update({
        where: { id },
        data: { 
          ...data, 
          title: titleValue,
          groupId, 
          facilityId,
          type: data.type || "ADULT",
          validityType: data.validityType || "FIXED_DATE"
        },
      })
    } else {
      await prisma.ticket.create({
        data: { 
          ...data, 
          title: titleValue,
          groupId, 
          facilityId,
          type: data.type || "ADULT",
          validityType: data.validityType || "FIXED_DATE"
        },
      })
    }

    revalidatePath(`/admin/facilities/${facilityId}`)
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function deleteTicketTierAction(id: string, facilityId: string) {
  try {
    await validateFacilityAccess(facilityId)
    await prisma.ticket.delete({ where: { id } })
    revalidatePath(`/admin/facilities/${facilityId}`)
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function reorderTiersAction(groupId: string, ids: string[], facilityId: string) {
  try {
    await validateFacilityAccess(facilityId)
    const validated = reorderSchema.parse({ groupId, ids })
    
    await prisma.$transaction(
      validated.ids.map((id, index) =>
        prisma.ticket.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    )

    revalidatePath(`/admin/facilities/${facilityId}`)
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}

export async function reorderTicketGroupsAction({ facilityId, orderedIds }: { facilityId: string, orderedIds: string[] }) {
  try {
    await validateFacilityAccess(facilityId)
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.ticketGroup.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    )

    revalidatePath(`/admin/facilities/${facilityId}`)
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}

export const reorderTicketsAction = withFacilityAccess(async ({ facilityId, orderedIds }: { facilityId: string, orderedIds: string[] }) => {
  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.ticket.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    )

    revalidatePath(`/admin/facilities/${facilityId}`)
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
})
