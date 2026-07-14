import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  addToCartAction: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/app/(server)/actions/cart", () => ({
  addToCartAction: mocks.addToCartAction,
}));

vi.mock("sonner", () => ({
  toast: { error: mocks.toastError },
}));

import { persistCartItem } from "@/lib/cart/persist-cart-item";

const item = {
  id: "item-1",
  ticketId: "11111111-1111-4111-8111-111111111111",
  quantity: 1,
  title: "Gradski bazen - Odrasli",
  price: 1250,
  currency: "RSD",
  facilityId: "22222222-2222-4222-8222-222222222222",
  updatedAt: Date.now(),
};

describe("persistCartItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the canonical persisted item", async () => {
    mocks.addToCartAction.mockResolvedValue({ success: true, data: { item } });

    await expect(persistCartItem({ ticketPriceId: item.ticketId, quantity: 1 })).resolves.toEqual(
      item,
    );
  });

  it("shows the server error and returns null after a rejected mutation", async () => {
    mocks.addToCartAction.mockResolvedValue({
      success: false,
      error: "Izabrana karta više nije dostupna.",
    });

    await expect(
      persistCartItem({ ticketPriceId: item.ticketId, quantity: 1 }),
    ).resolves.toBeNull();
    expect(mocks.toastError).toHaveBeenCalledWith("Izabrana karta više nije dostupna.");
  });

  it("handles an unexpected action failure without reporting success", async () => {
    mocks.addToCartAction.mockRejectedValue(new Error("network failure"));

    await expect(
      persistCartItem({ ticketPriceId: item.ticketId, quantity: 1 }),
    ).resolves.toBeNull();
    expect(mocks.toastError).toHaveBeenCalledWith("Greška pri dodavanju u korpu.");
  });
});
