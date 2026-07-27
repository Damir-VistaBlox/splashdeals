"use server";

import { prisma } from "@/app/(server)/lib/prisma";
import { validateFacilityAccess } from "@/app/(server)/lib/auth-guards";
import { revalidatePath } from "next/cache";

/**
 * Ticket product images must be uploaded client-side via @vercel/blob/client
 * (see ProductImageSection). Shipping raw File/FormData through a server action
 * blows past Vercel's function payload limit → FUNCTION_PAYLOAD_TOO_LARGE (413).
 *
 * These actions only mutate lightweight metadata (URL strings).
 */

async function assertProductAccess(productId: string) {
  const product = await prisma.ticketProduct.findUnique({
    where: { id: productId },
    select: {
      id: true,
      imageUrl: true,
      category: { select: { facilityId: true } },
    },
  });
  if (!product) throw new Error("Tip ulaznice nije pronađen");
  await validateFacilityAccess(product.category.facilityId);
  return product;
}

function revalidateTickets(facilityId: string) {
  revalidatePath(`/admin/facilities/${facilityId}/tickets`);
}

/** Persist a blob URL already uploaded by the browser. */
export async function setProductImageUrl(productId: string, imageUrl: string) {
  try {
    if (!imageUrl || typeof imageUrl !== "string") {
      return { success: false as const, error: "Nedostaje URL slike" };
    }
    // Guard: only accept our public blob host or https URLs — never data: URIs
    if (imageUrl.startsWith("data:")) {
      return {
        success: false as const,
        error: "Inline data-URL slike nisu dozvoljene. Otpremite preko blob storage.",
      };
    }
    if (!/^https:\/\//i.test(imageUrl)) {
      return { success: false as const, error: "Nevažeći URL slike" };
    }

    const product = await assertProductAccess(productId);

    if (product.imageUrl && product.imageUrl !== imageUrl) {
      const { del } = await import("@vercel/blob");
      await del(product.imageUrl).catch(() => {});
    }

    await prisma.ticketProduct.update({
      where: { id: productId },
      data: { imageUrl },
    });

    revalidateTickets(product.category.facilityId);
    return { success: true as const, url: imageUrl };
  } catch (e) {
    return {
      success: false as const,
      error: e instanceof Error ? e.message : "Čuvanje URL-a slike nije uspelo",
    };
  }
}

export async function deleteProductImage(productId: string, imageUrl: string) {
  try {
    const product = await assertProductAccess(productId);
    if (imageUrl) {
      const { del } = await import("@vercel/blob");
      await del(imageUrl).catch(() => {});
    }
    await prisma.ticketProduct.update({
      where: { id: productId },
      data: { imageUrl: null },
    });
    revalidateTickets(product.category.facilityId);
    return { success: true as const };
  } catch (e) {
    return {
      success: false as const,
      error: e instanceof Error ? e.message : "Brisanje slike nije uspelo",
    };
  }
}
