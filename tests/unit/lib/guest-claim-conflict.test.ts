import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearGuestClaimConflict,
  isGuestClaimHandled,
  markGuestClaimHandled,
  readGuestClaimConflict,
  storeGuestClaimConflict,
} from "@/lib/cart/guest-claim-conflict";

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

describe("guest-claim-conflict handoff", () => {
  beforeEach(() => {
    vi.stubGlobal("sessionStorage", createMemoryStorage());
    vi.stubGlobal("window", {
      dispatchEvent: vi.fn(),
    });
  });

  it("stores and reads conflict payload without marking claim handled", () => {
    storeGuestClaimConflict("user-1", {
      guestFacilityName: "Guest Park",
      userFacilityName: "User Park",
    });

    expect(isGuestClaimHandled("user-1")).toBe(false);
    expect(readGuestClaimConflict("user-1")).toEqual({
      guestFacilityName: "Guest Park",
      userFacilityName: "User Park",
    });
  });

  it("clears conflict and can mark claim handled after resolve", () => {
    storeGuestClaimConflict("user-1", {
      guestFacilityName: "A",
      userFacilityName: "B",
    });
    clearGuestClaimConflict("user-1");
    markGuestClaimHandled("user-1");

    expect(readGuestClaimConflict("user-1")).toBeNull();
    expect(isGuestClaimHandled("user-1")).toBe(true);
  });
});
