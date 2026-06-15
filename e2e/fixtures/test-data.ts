/**
 * 🌊 Splashdeals E2E Test Data Fixtures
 *
 * ⚠️ IMPORTANT: Replace these UUIDs with actual IDs from your database.
 *    Run this SQL to get real values:
 *
 *    SELECT t.id AS ticket_id, t.title, t.price, f.id AS facility_id, f.name AS facility_name
 *    FROM sales."Ticket" t
 *    JOIN sales."Facility" f ON f.id = t."facilityId"
 *    WHERE t."isActive" = true
 *    LIMIT 3;
 *
 * For local dev, these must point to tickets in your local test DB.
 * For CI, these should match the seeded test database.
 */

export const TEST_TICKETS = {
  /** An adult day pass with known price */
  ADULT_DAY_PASS: {
    id: "06582b4e-63ca-4bfd-ac0b-97195514ffd3",
    title: "Dnevna Karta - Odrasli (Radni dan)",
    quantity: 2,
  },
  /** A child pass for multi-item testing */
  CHILD_PASS: {
    id: "03c682e8-a85e-47b9-b75a-29338adafaa8",
    title: "Dnevni termin - Deca",
    quantity: 1,
  },
} as const;

export const TEST_FACILITIES = {
  WATER_PARK: {
    id: "50009558-5816-48bb-9023-85803957aa21",
    name: "Srebrno Jezero Aquapark",
  },
} as const;

export const TEST_USER = {
  email: "e2e-test@example.com",
  name: "E2E Test User",
} as const;
