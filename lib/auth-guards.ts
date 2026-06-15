import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

/**
 * 🛡️ Server Action Guard: Requires any Admin role (SUPER_ADMIN or FACILITY_STAFF)
 * Returns the user if authorized, otherwise throws an error or returns a failure object.
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Authentication required")
  }

  const role = session.user.role
  if (role !== "SUPER_ADMIN" && role !== "FACILITY_STAFF") {
    throw new Error("Unauthorized: Admin access required")
  }

  return session.user
}

/**
 * 👑 Server Action Guard: Requires SUPER_ADMIN role
 */
export async function requireSuperAdmin(options: { redirect?: boolean } = {}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    if (options.redirect) redirect("/auth/login?callbackUrl=/admin")
    throw new Error("Authentication required")
  }

  if (session.user.role !== "SUPER_ADMIN") {
    if (options.redirect) redirect("/admin/forbidden")
    throw new Error("Unauthorized: Super Admin access required")
  }

  return session.user
}

/**
 * 🏢 Facility Access Guard: Checks if admin has access to a specific facility
 * SUPER_ADMIN has access to everything.
 * FACILITY_STAFF must have an explicit assignment to this facility.
 */
export async function validateFacilityAccess(facilityId: string, user?: any) {
  const adminUser = user || await requireAdmin()
  
  if (adminUser.role === "SUPER_ADMIN") return adminUser

  // FACILITY_STAFF must have an explicit assignment to this facility
  const assignment = await prisma.facilityStaffAssignment.findUnique({
    where: {
      userId_facilityId: {
        userId: adminUser.id,
        facilityId,
      }
    }
  })

  if (!assignment) {
    throw new Error("Unauthorized: You do not have access to this facility")
  }

  return adminUser
}
