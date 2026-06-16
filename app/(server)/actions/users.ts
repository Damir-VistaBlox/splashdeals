"use server"

import { z } from "zod"
import { prisma } from "@/server/lib/prisma"
import { requireSuperAdmin } from "@/server/lib/auth-guards"
import { revalidatePath } from "next/cache"
import { UserRole } from "@prisma/client"
import { auth } from "@/server/lib/auth"

import { handleServerActionError } from "@/server/lib/server-action-error"

const createAdminUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(UserRole),
})

/**
 * 👥 Fetch all administrative users (Super Admins & Staff)
 */
export async function getAdminUsersAction(params?: { page?: number, limit?: number }) {
  try {
    await requireSuperAdmin()

    const page = params?.page || 1
    const limit = params?.limit || 15
    const skip = (page - 1) * limit
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: {
            in: [UserRole.SUPER_ADMIN, UserRole.FACILITY_STAFF]
          }
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skip
      }),
      prisma.user.count({
        where: {
          role: {
            in: [UserRole.SUPER_ADMIN, UserRole.FACILITY_STAFF]
          }
        }
      })
    ])

    return { success: true, data: users, totalCount, page, limit }
  } catch (error) {
    return handleServerActionError(error, "users")
  }
}

/**
 * 🎭 Update user role
 */
export async function updateUserRoleAction(userId: string, role: UserRole) {
  try {
    await requireSuperAdmin()
    await prisma.user.update({
      where: { id: userId },
      data: { role }
    })
    
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error, "users")
  }
}

/**
 * 🗑️ Remove user access
 */
export async function deleteUserAction(userId: string) {
  try {
    const currentUser = await requireSuperAdmin()
    
    if (currentUser.id === userId) {
      throw new Error("You cannot delete your own administrative account.")
    }
    
    await prisma.user.delete({
      where: { id: userId }
    })
    
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error, "users")
  }
}

/**
 * 🚀 Onboard new Admin user
 */
export async function createAdminUserAction(data: { name: string, email: string, password: string, role: UserRole }) {
  try {
    await requireSuperAdmin()

    const validated = createAdminUserSchema.parse(data)

    const result = await auth.api.signUpEmail({
      body: {
        email: validated.email,
        password: validated.password,
        name: validated.name,
        role: validated.role,
      }
    })

    if (!result) {
      throw new Error("Failed to create user account")
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error: unknown) {
    return handleServerActionError(error, "users")
  }
}
