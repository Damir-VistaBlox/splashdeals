import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearPersistedPromo, loadPersistedPromo, persistPromo } from "@/lib/cart/promo-persist";

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
}

describe("promo-persist", () => {
  beforeEach(() => {
    vi.stubGlobal("sessionStorage", createMemoryStorage());
  });

  it("round-trips discount info", () => {
    persistPromo({ campaignId: "c1", code: "LETO10", discountPercent: 10 });
    expect(loadPersistedPromo()).toEqual({
      campaignId: "c1",
      code: "LETO10",
      discountPercent: 10,
    });
    clearPersistedPromo();
    expect(loadPersistedPromo()).toBeNull();
  });
});
