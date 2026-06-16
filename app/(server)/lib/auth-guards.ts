import { auth } from "@/server/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/server/lib/prisma"
import { AUTH_ERROR } from "@/server/lib/error-messages"

export type AuthedUser = {
  id: string;
  name: string | null;
  email: string;
  role: string | null | undefined;
};

/**
 * 🛡️ Server Action Guard: Requires any Admin role (SUPER_ADMIN or FACILITY_STAFF)
 * Returns the user if authorized, otherwise throws an error or returns a failure object.
 */
export async function requireAdmin(): Promise<AuthedUser> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error(AUTH_ERROR.REQUIRED)
  }

  const role = session.user.role?.toUpperCase()
  if (role !== "SUPER_ADMIN" && role !== "FACILITY_STAFF") {
    throw new Error(AUTH_ERROR.UNAUTHORIZED_ADMIN)
  }

  return session.user
}

/**
 * 👑 Server Action Guard: Requires SUPER_ADMIN role
 * NOTE: `options.redirect` uses Next.js `redirect()` which is only valid
 * in Server Components and Server Actions. Do not use in API routes.
 */
export async function requireSuperAdmin(options: { redirect?: boolean } = {}): Promise<AuthedUser> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    if (options.redirect) redirect("/auth/login?callbackUrl=/admin")
    throw new Error(AUTH_ERROR.REQUIRED)
  }

  if (session.user.role?.toUpperCase() !== "SUPER_ADMIN") {
    if (options.redirect) redirect("/admin/forbidden")
    throw new Error(AUTH_ERROR.UNAUTHORIZED_SUPER_ADMIN)
  }

  return session.user
}

/**
 * 🏢 Facility Access Guard: Checks if admin has access to a specific facility
 * SUPER_ADMIN has access to everything.
 * FACILITY_STAFF must have an explicit assignment to this facility.
 */
export async function validateFacilityAccess(facilityId: string, user?: AuthedUser): Promise<AuthedUser> {
  const adminUser = user || await requireAdmin()
  
  if (adminUser.role?.toUpperCase() === "SUPER_ADMIN") return adminUser

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
    throw new Error(AUTH_ERROR.UNAUTHORIZED_FACILITY)
  }

  return adminUser
}
