import { describe, expect, it } from "vitest";
import {
  getEffectiveOpenState,
  hasActiveClosure,
  isDiscoverable,
  isOpenOnDay,
  isPurchasable,
  isScannable,
} from "@/lib/facility/availability";

const monOpen = { dayOfWeek: 1, isClosed: false };
const monClosed = { dayOfWeek: 1, isClosed: true };
// 2026-07-20 is a Monday
const monday = new Date("2026-07-20T12:00:00");

describe("facility availability", () => {
  it("isDiscoverable only for ACTIVE", () => {
    expect(isDiscoverable("ACTIVE")).toBe(true);
    expect(isDiscoverable("DRAFT")).toBe(false);
    expect(isDiscoverable("CLOSED")).toBe(false);
    expect(isDiscoverable("EMERGENCY_SHUTDOWN")).toBe(false);
  });

  it("isOpenOnDay respects weekly isClosed", () => {
    expect(isOpenOnDay([monOpen], monday)).toBe(true);
    expect(isOpenOnDay([monClosed], monday)).toBe(false);
    expect(isOpenOnDay([], monday)).toBe(false);
  });

  it("hasActiveClosure detects inclusive window", () => {
    const closures = [
      {
        startDate: "2026-07-19T00:00:00.000Z",
        endDate: "2026-07-21T23:59:59.999Z",
      },
    ];
    expect(hasActiveClosure(closures, monday)).toBe(true);
    expect(hasActiveClosure(closures, new Date("2026-07-22T12:00:00Z"))).toBe(false);
  });

  it("isPurchasable: ACTIVE + open + no closure", () => {
    expect(isPurchasable({ status: "ACTIVE", hours: [monOpen], closures: [] }, monday)).toBe(true);
  });

  it("isPurchasable: blocks CLOSED / DRAFT / EMERGENCY", () => {
    expect(isPurchasable({ status: "CLOSED", hours: [monOpen] }, monday)).toBe(false);
    expect(isPurchasable({ status: "DRAFT", hours: [monOpen] }, monday)).toBe(false);
    expect(isPurchasable({ status: "EMERGENCY_SHUTDOWN", hours: [monOpen] }, monday)).toBe(false);
  });

  it("isPurchasable: ACTIVE + temporary closure blocks purchase", () => {
    expect(
      isPurchasable(
        {
          status: "ACTIVE",
          hours: [monOpen],
          closures: [
            {
              startDate: "2026-07-19T00:00:00.000Z",
              endDate: "2026-07-21T23:59:59.999Z",
            },
          ],
        },
        monday,
      ),
    ).toBe(false);
  });

  it("isPurchasable: ACTIVE + weekly closed day blocks purchase", () => {
    expect(isPurchasable({ status: "ACTIVE", hours: [monClosed], closures: [] }, monday)).toBe(
      false,
    );
  });

  it("isScannable: EMERGENCY hard-stops even if hours open", () => {
    expect(
      isScannable({ status: "EMERGENCY_SHUTDOWN", hours: [monOpen], closures: [] }, monday),
    ).toBe(false);
  });

  it("isScannable: ACTIVE open day allows scan", () => {
    expect(isScannable({ status: "ACTIVE", hours: [monOpen], closures: [] }, monday)).toBe(true);
  });

  it("getEffectiveOpenState matrix", () => {
    expect(getEffectiveOpenState({ status: "DRAFT" })).toBe("draft");
    expect(getEffectiveOpenState({ status: "CLOSED" })).toBe("closed");
    expect(getEffectiveOpenState({ status: "EMERGENCY_SHUTDOWN" })).toBe("emergency");
    expect(
      getEffectiveOpenState(
        {
          status: "ACTIVE",
          hours: [monOpen],
          closures: [
            {
              startDate: "2026-07-19T00:00:00.000Z",
              endDate: "2026-07-21T23:59:59.999Z",
            },
          ],
        },
        monday,
      ),
    ).toBe("temporary_closure");
    expect(getEffectiveOpenState({ status: "ACTIVE", hours: [monClosed] }, monday)).toBe(
      "weekly_closed",
    );
    expect(getEffectiveOpenState({ status: "ACTIVE", hours: [monOpen] }, monday)).toBe("open");
  });
});
