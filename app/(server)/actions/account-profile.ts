"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/app/(server)/lib/prisma";
import { requireAuth } from "@/app/(server)/lib/auth-guards";
import { handleServerActionError, type ActionResult } from "@/app/(server)/lib/server-action-error";

const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ime mora imati najmanje 2 karaktera")
    .max(80, "Ime može imati najviše 80 karaktera"),
});

/**
 * Update buyer display name on /nalog.
 */
export async function updateProfileNameAction(
  rawName: string,
): Promise<ActionResult<{ name: string }>> {
  try {
    const user = await requireAuth();
    const { name } = updateProfileSchema.parse({ name: rawName });

    await prisma.user.update({
      where: { id: user.id },
      data: { name },
    });

    revalidatePath("/nalog");
    revalidatePath("/moje-karte");
    return { success: true, data: { name } };
  } catch (error) {
    return handleServerActionError(error, "updateProfileName");
  }
}
