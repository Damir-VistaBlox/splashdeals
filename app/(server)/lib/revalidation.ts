import { revalidatePath } from "next/cache"

export const ADMIN_PATHS = {
  facilities: {
    list: () => "/admin/facilities" as const,
    detail: (id: string) => `/admin/facilities/${id}` as const,
    amenities: (id: string) => `/admin/facilities/${id}/amenities` as const,
    media: (id: string) => `/admin/facilities/${id}/media` as const,
  },
  users: {
    list: () => "/admin/users" as const,
  },
} as const;

export const PUBLIC_PATHS = {
  facilityDetail: (slug: string) => `/facilities/[category]/${slug}` as const,
  facilityById: (id: string) => `/${id}` as const,
} as const;

export function revalidateAdmin(route: string, type?: "layout") {
  revalidatePath(route, type);
}

export function revalidateAdminFacilities() {
  revalidatePath(ADMIN_PATHS.facilities.list());
}

export function revalidateAdminFacility(facilityId: string) {
  revalidatePath(ADMIN_PATHS.facilities.detail(facilityId), "layout");
}

export function revalidateAdminAmenities(facilityId: string) {
  revalidatePath(ADMIN_PATHS.facilities.amenities(facilityId));
}

export function revalidateAdminMedia(facilityId: string, slug?: string) {
  revalidatePath(ADMIN_PATHS.facilities.media(facilityId));
  if (slug) {
    revalidatePath(PUBLIC_PATHS.facilityDetail(slug), "layout");
  }
}

export function revalidateAdminUsers() {
  revalidatePath(ADMIN_PATHS.users.list());
}
