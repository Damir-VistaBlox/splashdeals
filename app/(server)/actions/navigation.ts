"use server"

import { prisma } from "@/server/lib/prisma"
import { requireAdmin, requireSuperAdmin } from "@/server/lib/auth-guards"
import { handleServerActionError, type ActionResult } from "@/server/lib/server-action-error"
import { revalidatePath } from "next/cache"
import { z } from "zod/v4"

// ─── Schemas ───────────────────────────────────────────

export const menuSchema = z.object({
  label: z.string().min(1, "Naziv je obavezan"),
  icon: z.string().min(1, "Ikona je obavezna"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

export type MenuFormValues = z.infer<typeof menuSchema>

export const sectionSchema = z.object({
  menuId: z.string().uuid(),
  heading: z.string().optional().nullable(),
  column: z.number().int().min(0).max(2).default(0),
  style: z.enum(["LINKS", "DOT_LINKS", "DYNAMIC_CITIES", "FOOTER_BADGE", "VISUAL"]),
  config: z.any().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

export type SectionFormValues = z.infer<typeof sectionSchema>

export const itemSchema = z.object({
  sectionId: z.string().uuid(),
  label: z.string().min(1, "Naziv je obavezan"),
  href: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  desc: z.string().optional().nullable(),
  metadata: z.any().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

export type ItemFormValues = z.infer<typeof itemSchema>

export const reorderItemSchema = z.object({
  id: z.string().uuid(),
  sortOrder: z.number().int(),
})

// ─── Menu CRUD ─────────────────────────────────────────

export async function createMenuAction(
  data: z.infer<typeof menuSchema>
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
    const validated = menuSchema.parse(data)

    const menu = await prisma.navigationMenu.create({ data: validated })

    revalidatePath("/admin/cms/navigation")
    return { success: true, data: { id: menu.id } }
  } catch (error) {
    return handleServerActionError(error, "navigation/createMenu")
  }
}

export async function updateMenuAction(
  id: string,
  data: Partial<z.infer<typeof menuSchema>>
): Promise<ActionResult> {
  try {
    await requireAdmin()
    const validated = menuSchema.partial().parse(data)

    await prisma.navigationMenu.update({ where: { id }, data: validated })

    revalidatePath("/admin/cms/navigation")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error, "navigation/updateMenu")
  }
}

export async function deleteMenuAction(id: string): Promise<ActionResult> {
  try {
    await requireSuperAdmin()

    await prisma.navigationMenu.delete({ where: { id } })

    revalidatePath("/admin/cms/navigation")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error, "navigation/deleteMenu")
  }
}

export async function reorderMenusAction(
  items: z.infer<typeof reorderItemSchema>[]
): Promise<ActionResult> {
  try {
    await requireAdmin()
    const validated = z.array(reorderItemSchema).parse(items)

    await prisma.$transaction(
      validated.map((item) =>
        prisma.navigationMenu.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    )

    revalidatePath("/admin/cms/navigation")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error, "navigation/reorderMenus")
  }
}

// ─── Section CRUD ──────────────────────────────────────

export async function createSectionAction(
  data: z.infer<typeof sectionSchema>
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
    const validated = sectionSchema.parse(data)

    const section = await prisma.navigationMenuSection.create({ data: validated })

    revalidatePath("/admin/cms/navigation")
    return { success: true, data: { id: section.id } }
  } catch (error) {
    return handleServerActionError(error, "navigation/createSection")
  }
}

export async function updateSectionAction(
  id: string,
  data: Partial<z.infer<typeof sectionSchema>>
): Promise<ActionResult> {
  try {
    await requireAdmin()
    const validated = sectionSchema.partial().parse(data)

    await prisma.navigationMenuSection.update({ where: { id }, data: validated })

    revalidatePath("/admin/cms/navigation")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error, "navigation/updateSection")
  }
}

export async function deleteSectionAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()

    await prisma.navigationMenuSection.delete({ where: { id } })

    revalidatePath("/admin/cms/navigation")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error, "navigation/deleteSection")
  }
}

export async function reorderSectionsAction(
  items: (z.infer<typeof reorderItemSchema> & { column?: number })[]
): Promise<ActionResult> {
  try {
    await requireAdmin()

    await prisma.$transaction(
      items.map((item) =>
        prisma.navigationMenuSection.update({
          where: { id: item.id },
          data: {
            sortOrder: item.sortOrder,
            ...(item.column !== undefined ? { column: item.column } : {}),
          },
        })
      )
    )

    revalidatePath("/admin/cms/navigation")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error, "navigation/reorderSections")
  }
}

// ─── Item CRUD ─────────────────────────────────────────

export async function createItemAction(
  data: z.infer<typeof itemSchema>
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
    const validated = itemSchema.parse(data)

    const item = await prisma.navigationMenuItem.create({ data: validated })

    revalidatePath("/admin/cms/navigation")
    return { success: true, data: { id: item.id } }
  } catch (error) {
    return handleServerActionError(error, "navigation/createItem")
  }
}

export async function updateItemAction(
  id: string,
  data: Partial<z.infer<typeof itemSchema>>
): Promise<ActionResult> {
  try {
    await requireAdmin()
    const validated = itemSchema.partial().parse(data)

    await prisma.navigationMenuItem.update({ where: { id }, data: validated })

    revalidatePath("/admin/cms/navigation")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error, "navigation/updateItem")
  }
}

export async function deleteItemAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()

    await prisma.navigationMenuItem.delete({ where: { id } })

    revalidatePath("/admin/cms/navigation")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error, "navigation/deleteItem")
  }
}

export async function reorderItemsAction(
  items: (z.infer<typeof reorderItemSchema> & { sectionId?: string })[]
): Promise<ActionResult> {
  try {
    await requireAdmin()

    await prisma.$transaction(
      items.map((item) =>
        prisma.navigationMenuItem.update({
          where: { id: item.id },
          data: {
            sortOrder: item.sortOrder,
            ...(item.sectionId !== undefined ? { sectionId: item.sectionId } : {}),
          },
        })
      )
    )

    revalidatePath("/admin/cms/navigation")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error, "navigation/reorderItems")
  }
}
