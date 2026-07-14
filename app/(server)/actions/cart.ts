"use server";

import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/(server)/lib/prisma";
import { auth } from "@/app/(server)/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { handleServerActionError, type ActionResult } from "@/app/(server)/lib/server-action-error";
import { MAX_QUANTITY_PER_ITEM, type CartItem, type CartItemInput } from "@/lib/types/cart";

// ─── DB-backed Rate Limiting ─────────────────────────────────────────────────

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_CALLS = 30; // max 30 mutations per minute
const TRANSACTION_MAX_ATTEMPTS = 3;

type CartDbClient = Pick<
  Prisma.TransactionClient,
  "cartSession" | "cartSessionItem" | "ticketPrice"
>;

async function withSerializableRetry<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  for (let attempt = 1; attempt <= TRANSACTION_MAX_ATTEMPTS; attempt += 1) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      const retryable =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === "P2034" || error.code === "P2002");
      if (!retryable || attempt === TRANSACTION_MAX_ATTEMPTS) throw error;
    }
  }

  throw new Error("Transakcija korpe nije uspela.");
}

async function checkRateLimit(userId: string): Promise<boolean> {
  return withSerializableRetry(async (tx) => {
    const now = new Date();
    const entry = await tx.cartRateLimit.findUnique({ where: { userId } });
    if (!entry || now > entry.resetAt) {
      await tx.cartRateLimit.upsert({
        where: { userId },
        create: { userId, callCount: 1, resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS) },
        update: { callCount: 1, resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS) },
      });
      return true;
    }
    if (entry.callCount >= RATE_LIMIT_MAX_CALLS) return false;
    await tx.cartRateLimit.update({
      where: { userId },
      data: { callCount: { increment: 1 } },
    });
    return true;
  });
}

// ─── Zod Schemas ────────────────────────────────────────────────────────────

const addToCartSchema = z.object({
  ticketPriceId: z.string().uuid(),
  quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_ITEM),
});

const removeFromCartSchema = z.object({
  itemId: z.string().min(1),
});

const updateCartQuantitySchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(0).max(MAX_QUANTITY_PER_ITEM),
});

// ─── Plain Object Serializer ────────────────────────────────────────────────

/**
 * Converts a Prisma CartSessionItem to the CartItem interface used by the client.
 * CUID ids are passed through as-is (no uuid check needed).
 */
function toCartItem(item: {
  id: string;
  ticketPriceId: string;
  quantity: number;
  title: string;
  price: number;
  currency: string;
  facilityId: string;
  facilityName: string | null;
  category: string | null;
  validityType: string | null;
  requiresIdentity: boolean;
  requiresPhoto: boolean;
  imageUrl: string | null;
  minPeople: number | null;
  maxPeople: number | null;
  updatedAt: Date;
}): CartItem {
  return {
    id: item.id,
    ticketId: item.ticketPriceId,
    quantity: item.quantity,
    title: item.title,
    price: item.price,
    currency: item.currency,
    facilityId: item.facilityId,
    facilityName: item.facilityName ?? undefined,
    category: item.category ?? undefined,
    validityType: item.validityType ?? undefined,
    requiresIdentity: item.requiresIdentity,
    requiresPhoto: item.requiresPhoto,
    imageUrl: item.imageUrl,
    minPeople: item.minPeople ?? undefined,
    maxPeople: item.maxPeople ?? undefined,
    updatedAt: item.updatedAt.getTime(),
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getOrCreateCartSession(userId: string, db: CartDbClient = prisma) {
  return db.cartSession.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

async function getCartSession(userId: string) {
  return prisma.cartSession.findUnique({ where: { userId } });
}

async function getCanonicalTicket(ticketPriceId: string, db: CartDbClient = prisma) {
  const ticketPrice = await db.ticketPrice.findUnique({
    where: { id: ticketPriceId },
    include: {
      ticketType: {
        include: {
          category: { include: { facility: true } },
        },
      },
    },
  });

  const now = new Date();
  if (
    !ticketPrice ||
    !ticketPrice.isActive ||
    !ticketPrice.ticketType.isActive ||
    !ticketPrice.ticketType.category.isActive ||
    ticketPrice.ticketType.category.facility.status !== "ACTIVE" ||
    (ticketPrice.validFrom && ticketPrice.validFrom > now) ||
    (ticketPrice.validTo && ticketPrice.validTo < now) ||
    (ticketPrice.saleStart && ticketPrice.saleStart > now) ||
    (ticketPrice.saleEnd && ticketPrice.saleEnd < now)
  ) {
    return null;
  }

  return ticketPrice;
}

/**
 * Reads cart items from the relational CartSessionItem table.
 */
async function readCartItems(cartId: string): Promise<CartItem[]> {
  const items = await prisma.cartSessionItem.findMany({
    where: { cartId },
    orderBy: { createdAt: "asc" },
  });
  return items.map(toCartItem);
}

// ─── Server Actions ─────────────────────────────────────────────────────────

export async function addToCartAction(
  input: CartItemInput,
): Promise<ActionResult<{ item: CartItem }>> {
  try {
    const data = addToCartSchema.parse(input);

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, error: "Morate biti prijavljeni da biste dodali u korpu." };
    }

    if (!(await checkRateLimit(session.user.id))) {
      return { success: false, error: "Previše zahteva. Pokušajte ponovo za minut." };
    }

    const result = await withSerializableRetry(async (tx) => {
      const ticketPrice = await getCanonicalTicket(data.ticketPriceId, tx);
      if (!ticketPrice) {
        return { success: false, error: "Izabrana karta više nije dostupna." } as const;
      }

      const ticketType = ticketPrice.ticketType;
      const facility = ticketType.category.facility;
      const minimumQuantity = Math.max(1, ticketType.minPeople);
      const maximumQuantity = Math.min(
        ticketType.maxPeople ?? MAX_QUANTITY_PER_ITEM,
        MAX_QUANTITY_PER_ITEM,
      );

      if (data.quantity < minimumQuantity || data.quantity > maximumQuantity) {
        return {
          success: false,
          error: `Dozvoljena količina za ovu kartu je od ${minimumQuantity} do ${maximumQuantity}.`,
        } as const;
      }

      const cartSession = await getOrCreateCartSession(session.user.id, tx);
      if (cartSession.locked) {
        const lockedAt = cartSession.lockedAt;
        if (lockedAt && Date.now() - lockedAt.getTime() < 300_000) {
          return {
            success: false,
            error: "Checkout je u toku. Sačekajte da se završi.",
          } as const;
        }
        await tx.cartSession.update({
          where: { id: cartSession.id },
          data: { locked: false, lockedAt: null },
        });
      }

      const differentFacilityItem = await tx.cartSessionItem.findFirst({
        where: {
          cartId: cartSession.id,
          facilityId: { not: facility.id },
        },
      });
      if (differentFacilityItem) {
        return {
          success: false,
          error: "U jednoj korpi možete imati karte samo za jedan objekat.",
        } as const;
      }

      const existing = await tx.cartSessionItem.findUnique({
        where: {
          cartId_ticketPriceId: {
            cartId: cartSession.id,
            ticketPriceId: data.ticketPriceId,
          },
        },
      });

      const canonicalData = {
        facilityId: facility.id,
        title: `${facility.name} - ${ticketType.title}${ticketPrice.label ? ` (${ticketPrice.label})` : ""}`,
        price: Number(ticketPrice.price),
        currency: "RSD",
        facilityName: facility.name,
        category: facility.category,
        validityType: ticketType.validityType,
        requiresIdentity: ticketType.requiresIdentity,
        requiresPhoto: ticketType.requiresPhoto,
        imageUrl: ticketType.imageUrl,
        minPeople: minimumQuantity,
        maxPeople: ticketType.maxPeople,
      };

      if (existing) {
        const newQty = existing.quantity + data.quantity;
        if (newQty > maximumQuantity) {
          return {
            success: false,
            error: `Maksimalna količina za ovu kartu je ${maximumQuantity}.`,
          } as const;
        }
        const updated = await tx.cartSessionItem.update({
          where: { id: existing.id },
          data: { ...canonicalData, quantity: newQty },
        });
        return { success: true, data: { item: toCartItem(updated) } } as const;
      }

      const created = await tx.cartSessionItem.create({
        data: {
          cartId: cartSession.id,
          ticketPriceId: data.ticketPriceId,
          quantity: data.quantity,
          ...canonicalData,
        },
      });

      return { success: true, data: { item: toCartItem(created) } } as const;
    });

    if (result.success) revalidatePath("/cart");
    return result;
  } catch (error) {
    return handleServerActionError(error, "addToCart");
  }
}

export async function getCartAction(): Promise<ActionResult<{ items: CartItem[] }>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: true, data: { items: [] } };
    }

    const cartSession = await getCartSession(session.user.id);
    const items = cartSession ? await readCartItems(cartSession.id) : [];

    return { success: true, data: { items } };
  } catch (error) {
    return handleServerActionError(error, "getCart");
  }
}

export async function removeFromCartAction(
  input: z.infer<typeof removeFromCartSchema>,
): Promise<ActionResult<{ removed: boolean }>> {
  try {
    const { itemId } = removeFromCartSchema.parse(input);

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, error: "Morate biti prijavljeni." };
    }

    if (!(await checkRateLimit(session.user.id))) {
      return { success: false, error: "Previše zahteva. Pokušajte ponovo za minut." };
    }

    const cartSession = await getCartSession(session.user.id);
    if (!cartSession) {
      return { success: false, error: "Stavka nije pronađena u vašoj korpi." };
    }

    const deleted = await prisma.cartSessionItem.deleteMany({
      where: { id: itemId, cartId: cartSession.id },
    });
    if (deleted.count === 0) {
      return { success: false, error: "Stavka nije pronađena u vašoj korpi." };
    }

    revalidatePath("/cart");
    return { success: true, data: { removed: true } };
  } catch (error) {
    return handleServerActionError(error, "removeFromCart");
  }
}

export async function updateCartQuantityAction(
  input: z.infer<typeof updateCartQuantitySchema>,
): Promise<ActionResult<{ item: CartItem } | { cleared: boolean }>> {
  try {
    const { itemId, quantity } = updateCartQuantitySchema.parse(input);

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, error: "Morate biti prijavljeni." };
    }

    if (!(await checkRateLimit(session.user.id))) {
      return { success: false, error: "Previše zahteva. Pokušajte ponovo za minut." };
    }

    const cartSession = await getCartSession(session.user.id);
    if (!cartSession) {
      return { success: false, error: "Stavka nije pronađena u vašoj korpi." };
    }

    const ownedItem = await prisma.cartSessionItem.findFirst({
      where: { id: itemId, cartId: cartSession.id },
    });
    if (!ownedItem) {
      return { success: false, error: "Stavka nije pronađena u vašoj korpi." };
    }

    if (quantity <= 0) {
      await prisma.cartSessionItem.deleteMany({
        where: { id: itemId, cartId: cartSession.id },
      });
      revalidatePath("/cart");
      return { success: true, data: { cleared: true } };
    }

    const minimumQuantity = Math.max(1, ownedItem.minPeople ?? 1);
    const maximumQuantity = Math.min(
      ownedItem.maxPeople ?? MAX_QUANTITY_PER_ITEM,
      MAX_QUANTITY_PER_ITEM,
    );
    if (quantity < minimumQuantity || quantity > maximumQuantity) {
      return {
        success: false,
        error: `Dozvoljena količina za ovu kartu je od ${minimumQuantity} do ${maximumQuantity}.`,
      };
    }

    const updated = await prisma.cartSessionItem.update({
      where: { id: itemId, cartId: cartSession.id },
      data: { quantity },
    });

    revalidatePath("/cart");
    return { success: true, data: { item: toCartItem(updated) } };
  } catch (error) {
    return handleServerActionError(error, "updateCartQuantity");
  }
}

export async function clearCartAction(): Promise<ActionResult<{ cleared: boolean }>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, error: "Morate biti prijavljeni." };
    }

    const cartSession = await getCartSession(session.user.id);

    if (cartSession) {
      // Delete all items for this cart session
      await prisma.cartSessionItem.deleteMany({
        where: { cartId: cartSession.id },
      });
      // Reset cart session state
      await prisma.cartSession.update({
        where: { id: cartSession.id },
        data: { locked: false, lockedAt: null },
      });
    }

    revalidatePath("/cart");
    return { success: true, data: { cleared: true } };
  } catch (error) {
    return handleServerActionError(error, "clearCart");
  }
}

/**
 * 🔒 Lock or unlock a user's cart session.
 * Called by checkout.ts to prevent concurrent mutations during checkout.
 * Lock auto-expires after 5 minutes (TTL checked in addToCartAction).
 */
export async function setCartLockAction(
  locked: boolean,
): Promise<ActionResult<{ locked: boolean }>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, error: "You must be logged in." };
    }

    const cartSession = await getCartSession(session.user.id);

    if (cartSession) {
      await prisma.cartSession.update({
        where: { id: cartSession.id },
        data: { locked, lockedAt: locked ? new Date() : null },
      });
    }

    return { success: true, data: { locked } };
  } catch (error) {
    return handleServerActionError(error, "setCartLock");
  }
}
