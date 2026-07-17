import { describe, expect, it } from "vitest";
import { cartCurrency, parseAppliedPromo, type CartReconcileNotice } from "@/lib/cart/cart-helpers";

describe("cart-helpers", () => {
  it("parses applied promo json", () => {
    expect(
      parseAppliedPromo({
        campaignId: "c1",
        code: "LETO10",
        discountPercent: 10,
      }),
    ).toEqual({ campaignId: "c1", code: "LETO10", discountPercent: 10 });
    expect(parseAppliedPromo(null)).toBeNull();
    expect(parseAppliedPromo({ code: "X" })).toBeNull();
  });

  it("picks currency from first line", () => {
    expect(cartCurrency([])).toBe("RSD");
    expect(cartCurrency([{ currency: "EUR" }, { currency: "RSD" }])).toBe("EUR");
  });

  it("notice shape supports facility deep-link fields", () => {
    const notice: CartReconcileNotice = { title: "Ticket", facilitySlug: "petroland" };
    expect(notice.facilitySlug).toBe("petroland");
  });
});
