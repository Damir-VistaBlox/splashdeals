/** @vitest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  addToCartAction: vi.fn(),
  openCart: vi.fn(),
  trackAddToCart: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/app/(server)/actions/cart", () => ({
  addToCartAction: mocks.addToCartAction,
}));

vi.mock("@/hooks/use-ui-state", () => ({
  useUIState: (selector: (state: { openCart: typeof mocks.openCart }) => unknown) =>
    selector({ openCart: mocks.openCart }),
}));

vi.mock("@/lib/analytics/events", () => ({
  trackAddToCart: mocks.trackAddToCart,
}));

vi.mock("@/lib/client-dictionaries", () => ({
  getClientDictionary: vi.fn(async () => ({})),
}));

vi.mock("sonner", () => ({
  toast: { error: mocks.toastError },
}));

import { AddToCartButton } from "@/components/cart/AddToCartButton";

const ticket = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Gradski bazen - Odrasli",
  price: 1250,
  currency: "RSD",
  validityType: "FLEXIBLE_30_DAY",
  requiresIdentity: false,
  requiresPhoto: false,
  minPeople: 1,
  maxPeople: 5,
  imageUrl: null,
  facility: {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Gradski bazen",
    category: "Bazen",
  },
};

describe("AddToCartButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an error and does not report success when persistence fails", async () => {
    mocks.addToCartAction.mockResolvedValue({
      success: false,
      error: "Korpa trenutno nije dostupna.",
    });

    render(<AddToCartButton ticket={ticket} />);
    fireEvent.click(screen.getByRole("button", { name: /Dodaj/i }));

    await waitFor(() => {
      expect(mocks.toastError).toHaveBeenCalledWith("Korpa trenutno nije dostupna.");
    });

    expect(mocks.addToCartAction).toHaveBeenCalledWith({
      ticketPriceId: ticket.id,
      quantity: 1,
    });
    expect(mocks.trackAddToCart).not.toHaveBeenCalled();
    expect(mocks.openCart).not.toHaveBeenCalled();
  });
});
