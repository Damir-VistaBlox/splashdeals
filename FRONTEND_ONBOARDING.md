# 🌊 Frontend Engineer Onboarding Summary

## Project Context: Splashdeals
Splashdeals is a high-performance water park ticket marketplace in Serbia. It leverages **Next.js 16 (PPR)** for speed and the **Antigravity Kit** for agent-driven operations.

## UI Architecture: Aquastream Pro Max
The design system, **Aquastream UI**, is a "Hydro-Premium" aesthetic.

### 1. Design Constraints
- **NO PURPLE**: Strictly avoid violet, indigo, or purple. Use Cyan, Teal, Slate, and Azure.
- **Glassmorphism**: High-refraction surfaces using `backdrop-blur-2xl` and `bg-white/[0.03]`.
- **Typography**: `Geist Sans` for UI, `Geist Mono` for data/pricing.
- **Motion**: Snap-spring animations via `framer-motion`.

### 2. Core Components (`components/ui`)
- `GlassCard.tsx`: The primary container with radial glow on hover.
- `LiquidButton.tsx`: High-gloss gradient buttons with active scaling.
- `GlobalAmbient.tsx`: Background animated orbs.
- `AmbientBackground.tsx`: Section-specific background effects.

## Routing & Performance

### 1. Next.js 16 Patterns
- **PPR-First**: Use `await connection()` in all dynamic segments (e.g., `layout.tsx`, `page.tsx`).
- **Catch-All Routing**: `app/(web)/[...slug]/page.tsx` handles unmatched routes and legacy redirects.
- **Partial Prerendering**: Suspense boundaries with high-fidelity skeletons are mandatory to eliminate CLS.
- **Proxy Gateway**: `proxy.ts` in the root handles edge-level routing, redirects, and simple auth checks.

### 2. State & Data
- **Zustand**: Used for client-side state (e.g., `use-cart.ts`).
- **Server Actions**: Located in `app/(server)/actions/`. Wrapped in Zod for safety.
- **Serialization**: Prisma `Decimal` must be converted to `number` or `string` before passing to Client Components.

## Development Workflow

### 1. Agent Ecosystem
- We coordinate with OpenClaw agents via the file-based bridge in `.agent/bridge/`.
- Check `.agent/bridge/tasks/` for incoming frontend assignments.

### 2. Quality & Validation
- **Lint**: Run `npm run lint`. Currently ~200 warnings (mostly `any` and unused vars) and a few critical errors.
- **Checklist**: Run `python .agent/scripts/checklist.py .` before finalising tasks.
- **Language**: Serbian (Latin) is the primary language for all user-facing strings.

## Current State Observations
- The `(mob)` route group mentioned in docs is currently missing from `app/`; mobile views are integrated into `(web)`.
- Critical lint errors exist in `OperationalPortal.tsx` and `operations-control-manager.tsx`.
- `tsc-errors.txt` indicates some type safety gaps that need addressing.
