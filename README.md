# 🌊 Splashdeals

**Water park ticket marketplace — Serbia.**

Multi-facility ticketing platform with dynamic pricing (day types, time slots, demographics), PWA digital wallet, and an AI-agent-driven ops layer.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (PPR) |
| Language | TypeScript |
| UI | Tailwind + shadcn/ui + framer-motion |
| Design | Aquastream UI (glassmorphism, dark theme) |
| Database | PostgreSQL (Neon) + Prisma 7 |
| Auth | Better Auth |
| Payments | Stripe |
| State | Zustand |
| Forms | react-hook-form + Zod |
| E2E | Playwright |
| Deployment | Vercel |

## Architecture

```
app/
├── (web)/       # Desktop marketplace — facility pages, search, checkout
├── (mob)/       # Mobile PWA — digital wallet, quick purchase
├── (server)/    # Gateway — API routes, Server Actions, webhooks
└── (admin)/     # Management hub — TanStack Tables, Recharts
```

Database is split into three schemas:

- **`public`** — shared primitives
- **`partners`** — facilities, ticket groups, tiers, pricing
- **`sales`** — transactions, issued tickets, payouts
- **`admin`** — users, sessions, accounts

## Key Domain Models

```
Facility → TicketGroup → TicketTier
                      ↕
                 IssuedTicket
```

Flexible pricing supports weekday/weekend/holiday, time slots (full day / after 16h / 3h), demographic tiers (adult / child / student / family), and season passes.

## Getting Started

```sh
npm install
cp .env.example .env.local   # add DATABASE_URL, Stripe keys, etc.
npm run dev                   # → http://localhost:3000
```

Multi-schema migrations:

```sh
npx prisma migrate dev
npx prisma validate
```

## Agent Ecosystem

This project uses a cross-ecosystem bridge between agent runtimes:

- **OpenClaw agents** — persistent services (strategist, SEO ops, keyword planner)
- **Codex agents** — execution (frontend, backend, orchestrator)
- **Paperclip** — control plane orchestration (CEO, CTO agents)

Handoffs happen through `.agent/bridge/`. See [`.agent/bridge/PROTOCOL.md`](.agent/bridge/PROTOCOL.md) for the full protocol.

## Design System

Aquastream UI — immersive hydro-premium aesthetic. Dark theme with glassmorphism, cyan/teal/azure color palette. Strict **no purple** rule. See [`DESIGN.md`](DESIGN.md).

## Docs

| File | What |
|------|------|
| `AGENTS.md` | Agent protocols, routing rules, team roster |
| `DESIGN.md` | Full design system specification |
| `docs/plans/` | Archived architecture plans |
| `.agent/bridge/` | Cross-ecosystem agent handoff protocol |
