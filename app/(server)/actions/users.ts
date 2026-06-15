"use server"

import { prisma } from "@/lib/prisma"
import { requireSuperAdmin } from "@/lib/auth-guards"
import { revalidatePath } from "next/cache"
import { UserRole } from "@prisma/client"
import { auth } from "@/lib/auth"

import { handleServerActionError } from "@/lib/server-action-error"

/**
 * 👥 Fetch all administrative users (Super Admins & Staff)
 */
export async function getAdminUsersAction(params?: { page?: number, limit?: number }) {
  await requireSuperAdmin()
  
  const page = params?.page || 1
  const limit = params?.limit || 15
  const skip = (page - 1) * limit

  try {
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
    return handleServerActionError(error)
  }
}

/**
 * 🎭 Update user role
 */
export async function updateUserRoleAction(userId: string, role: UserRole) {
  await requireSuperAdmin()
  
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role }
    })
    
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
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
    return handleServerActionError(error)
  }
}

/**
 * 🚀 Onboard new Admin user
 */
export async function createAdminUserAction(data: { name: string, email: string, password: string, role: UserRole }) {
  try {
    await requireSuperAdmin()

    const result = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role
      }
    })

    if (!result) {
      throw new Error("Failed to create user account")
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error: any) {
    return handleServerActionError(error)
  }
}
