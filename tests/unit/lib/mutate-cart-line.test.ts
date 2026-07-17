import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  removeFromCartAction: vi.fn(),
  updateCartQuantityAction: vi.fn(),
}));

vi.mock("@/app/(server)/actions/cart", () => ({
  removeFromCartAction: mocks.removeFromCartAction,
  updateCartQuantityAction: mocks.updateCartQuantityAction,
  getCartAction: vi.fn(),
}));

import { useServerCart } from "@/hooks/use-server-cart";
import { mutateCartLine } from "@/lib/cart/mutate-cart-line";
import type { CartItem } from "@/lib/types/cart";

const baseItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: "line-1",
  ticketId: "t1",
  quantity: 2,
  title: "Test",
  price: 1000,
  currency: "RSD",
  facilityId: "f1",
  minPeople: 1,
  maxPeople: 10,
  updatedAt: Date.now(),
  ...overrides,
});

describe("mutateCartLine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useServerCart.setState({
      items: [baseItem(), baseItem({ id: "line-2", quantity: 1 })],
      isLoading: false,
      isHydrated: true,
      totalItems: 3,
      totalPrice: 3000,
      locked: false,
      refreshGeneration: 0,
    });
  });

  it("decrements quantity via update action for setQuantity above min", async () => {
    mocks.updateCartQuantityAction.mockResolvedValue({
      success: true,
      data: { item: baseItem({ quantity: 1 }) },
    });

    const result = await mutateCartLine({
      itemId: "line-1",
      mode: "setQuantity",
      quantity: 1,
    });

    expect(result.ok).toBe(true);
    expect(mocks.updateCartQuantityAction).toHaveBeenCalledWith({
      itemId: "line-1",
      quantity: 1,
    });
    expect(mocks.removeFromCartAction).not.toHaveBeenCalled();
  });

  it("removes only the target line and keeps siblings", async () => {
    mocks.removeFromCartAction.mockResolvedValue({
      success: true,
      data: { removed: true, items: [baseItem({ id: "line-2", quantity: 1 })] },
    });

    const result = await mutateCartLine({
      itemId: "line-1",
      mode: "removeLine",
    });

    expect(result.ok).toBe(true);
    expect(result.items.map((i) => i.id)).toEqual(["line-2"]);
    expect(useServerCart.getState().items.map((i) => i.id)).toEqual(["line-2"]);
  });

  it("removeOneUnit decreases when above min, deletes at min", async () => {
    mocks.updateCartQuantityAction.mockResolvedValue({
      success: true,
      data: { item: baseItem({ quantity: 1 }) },
    });

    await mutateCartLine({ itemId: "line-1", mode: "removeOneUnit" });
    expect(mocks.updateCartQuantityAction).toHaveBeenCalled();

    useServerCart.setState({
      items: [baseItem({ quantity: 1 })],
      totalItems: 1,
      totalPrice: 1000,
      locked: false,
      refreshGeneration: 0,
      isLoading: false,
      isHydrated: true,
    });
    mocks.removeFromCartAction.mockResolvedValue({
      success: true,
      data: { removed: true, items: [] },
    });

    await mutateCartLine({ itemId: "line-1", mode: "removeOneUnit" });
    expect(mocks.removeFromCartAction).toHaveBeenCalledWith({ itemId: "line-1" });
  });

  it("rolls back optimistic state on server error", async () => {
    mocks.removeFromCartAction.mockResolvedValue({
      success: false,
      error: "Plaćanje je u toku. Otkažite ga pre izmene korpe.",
    });

    const before = useServerCart.getState().items;
    const result = await mutateCartLine({
      itemId: "line-1",
      mode: "removeLine",
      errorFallback: "fail",
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain("Plaćanje");
    expect(useServerCart.getState().items).toEqual(before);
  });
});
