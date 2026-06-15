# 🌊 Backend Engineer Onboarding Summary

## Project Context: Splashdeals
Splashdeals is a water park ticket marketplace in Serbia, built with **Next.js 16 (PPR)** and **Prisma 7**.

## Core Backend Architecture

### 1. Database Schema (Prisma)
- **Multi-schema PostgreSQL (Neon)**:
  - `admin`: Users, Sessions, Accounts (Better Auth).
  - `partners`: Facilities, TicketGroups, Tickets, Amenities, Media.
  - `sales`: Transactions, IssuedTickets.
  - `public`: Subscribers.
- **Key Relationships**: `Facility` → `TicketGroup` → `Ticket` (Tier). `IssuedTicket` links back to `Ticket` and `Transaction`.

### 2. Edge Gateway (`proxy.ts`)
- Replaces `middleware.ts`.
- Handles URL normalization, canonical redirects (Apex → WWW), i18n prefix removal, and lite edge auth for `/admin`.
- Injects Affiliate Referral cookies.

### 3. Server Actions & API
- **Location**: `app/(server)/actions/` and `app/(server)/api/`.
- **Validation**: Strict Zod schema enforcement for all actions.
- **Auth Guards**: `validateFacilityAccess` and `withFacilityAccess` wrapper for tenant isolation.
- **Cache**: Uses `revalidatePath` for targeted invalidations.

### 4. Stripe Integration
- **Webhook Handler**: `app/(server)/api/webhooks/stripe/route.ts`.
- **Fulfillment**: Uses `after()` for background processing. Atomic fulfillment via Prisma transactions.
- **Idempotency**: `generateIdempotencyKey` in `lib/stripe-utils.ts`.

### 5. QR Ticketing
- `IssuedTicket` generates a unique `qrHash`.
- Email delivery with inline QR code attachments via `nodemailer`.

## Development Guidelines
- **No Purple**: Stick to Aqua, Teal, Slate, Azure.
- **Async Next**: Use `await connection()` in dynamic segments.
- **Decimal Safety**: Serialize Prisma `Decimal` to `number`/`string` for Client Components.
- **Bilingual**: Serbian (Latin) for user-facing, English for technical terms.

## Verification Status
- **Lint**: 0 errors, 168 warnings (mostly unused vars/any).
- **Types**: (TBD - check `tsc-errors.txt` shows some issues exist).

## Next Steps
- Address high-priority backend tasks from the board.
- Clean up `any` types in critical path (webhook, fulfillment).
- Investigate `tsc-errors.txt` to improve type safety.
