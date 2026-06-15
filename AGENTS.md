<!-- BEGIN:antigravity-rules -->
# 🌊 Splashdeals: Agent Protocol (Pro Max)

You are operating within a high-performance **Next.js 16 (PPR)** environment integrated with the **Antigravity Kit**. 

### 🏗️ Routing & Domain Protocol
- **(web)**: Desktop-first marketplace. Use high-density layouts and glassmorphism.
- **(mob)**: PWA/Wallet hub. Prioritize touch-targets (>44px) and mobile performance.
- **(server)**: Gateway only. Shared logic, API routes, and Server Actions.
- **(admin)**: Management hub. Use TanStack Tables and Recharts for data density.

### 🛡️ Edge Routing (proxy.ts)
- **Middleware Deprecation**: Do NOT use `middleware.ts`. All request interception, redirects, and cookie management must be handled in `proxy.ts` in the project root.
- **Next.js 16 Standard**: Align with the new `proxy` file convention (requires named export `proxy`) for better edge-runtime optimization and PPR compatibility.

### ⚡ Next.js 16 (Partial Prerendering)
- **Mandatory Async**: Use `await connection()` from `next/server` in all dynamic route segments.
- **Suspended Session**: Use `await auth.getSession()` within `<Suspense>` boundaries to avoid prerendering bails on the entire page.
- **Skeleton Protocol**: All `<Suspense>` fallbacks MUST use high-fidelity Skeleton UI that mirrors final layouts to eliminate CLS.
- **Safe Actions**: Wrap Server Actions in a validator utility (Zod) for strict schema enforcement and edge-safety.
- **Proxy Context**: Do not rely on middleware-injected headers—use the `proxy.ts` gateway for global request transformations.
- **Data Boundary**: No direct Prisma `Decimal` transfer to Client Components—must serialize via DTOs/Zod.

### 🎨 Aquastream UI (Design System)
- **🔴 THE PURPLE BAN**: Do not use violet, indigo, or purple hues. Stick to Aqua, Teal, Slate, and Azure.
- **Glassmorphism**: Use `backdrop-blur-md` with `bg-white/15` or `bg-slate-950/25` for surface layers.
- **Responsive SLA**: Interactions must respond <100ms. Use React 19's `useTransition` for all heavy mutations.
- **Animations**: Use `framer-motion`. High-quality transitions are required for all UI components.

### 📈 SEO & GEO (Generative Engine Optimization)
- **Metadata mandatory**: Every page in `(web)` must export a `generateMetadata` function or a static `Metadata` object.
- **Structured Data**: Marketplace/Deal pages MUST inject JSON-LD schema to maximize machine readability for generative search engines (GEO).
- **Semantic HTML**: Use proper `<section>`, `<article>`, and `<h1>` hierarchy to maximize machine readability.

### 💾 Data & Operations
- **Multi-Schema**: Respect schema boundaries (`public`, `partners`, `sales`).
- **Safety**: No code changes to `prisma/` without running `prisma validate`.
- **Enforcement**: Run `python .agent/scripts/checklist.py .` before finalizing any turn.

### 🔗 Reference Docs
- Architecture: `.agent/ARCHITECTURE.md`
- Skills: `.agent/skills/`
- **Bridge Protocol**: `.agent/bridge/PROTOCOL.md`
- **Full Team Roster**: `.agent/bridge/ROSTER.md`

### 🌉 Cross-Ecosystem Bridge
Splashdeals uses two agent ecosystems that communicate through file-based handoffs:

- **OpenClaw Agents** (persistent services) — strategist, seo-specialist, keyword-planner
- **Codex Agents** (code execution) — orchestrator, frontend, backend, etc.

**How they talk:**
- OpenClaw writes tasks → `.agent/bridge/tasks/` → Codex picks them up
- Codex writes results → `.agent/bridge/reports/` → OpenClaw reads them
- See `.agent/bridge/PROTOCOL.md` for details
- **Strategist (OpenClaw)** is the bridge coordinator — check the bridge directory on every session
<!-- END:antigravity-rules -->

## 👥 AionUI Team: SplashDeals
The following agents are part of the active SplashDeals team. This is the **single source of truth** for all team members. For the full cross-ecosystem roster, see `.agent/bridge/ROSTER.md`.

### Active Team Roster
| # | Name | Backend | Role | Definition Location |
|---|---|---|---|---|
| 1 | **Leader** | AionRS | Team coordination & strategy | *(promoted 2026-05-03)* |
| 2 | **Frank** | OpenClaw | DevOps — infra, deployments, monitoring, bridge coordination | `AGENTS.md` |
| 3 | **Splashdeals Keyword Planner** | OpenClaw | SEO & keyword research | `AGENTS.md` |
| 4 | **Splashdeals SEO Ops** 😈 | OpenClaw | GSC monitoring, keyword tracking, SEO analysis & recommendations | `~/.openclaw/agents/seo-specialist/agent/AGENTS.md` |
| 5 | **Facebook Specialist** | Codex | Facebook ad campaigns, Pixel integration, and page management | `this agent` |

### Agent Details

**1. Leader (AionRS)** — Team coordination, task breakdown, and synthesis. Replaced the former Gemini Leader on 2026-05-03.

**2. Frank (OpenClaw)** — DevOps. Handles infrastructure, deployments, monitoring, and bridge coordination between OpenClaw and Codex ecosystems. Does NOT write code or create tasks. Checks `.agent/bridge/` regularly.

**3. Splashdeals Keyword Planner (OpenClaw)** — SEO keyword research and planning. Identifies high-value keywords, topic clusters, and search intent mapping for the Serbian water park market.

**4. Splashdeals SEO Ops 😈 (OpenClaw)** — GSC monitoring, keyword tracking, SEO analysis & recommendations. Boundary: does NOT modify code — analyzes data and produces reports. Core files: `IDENTITY.md`, `SOUL.md`, `AGENTS.md` at `~/.openclaw/agents/seo-specialist/agent/`. Seasonal strategy: pre-summer keyword push (Apr-May), in-season monitoring (Jun-Aug). Bilingual: Serbian primary, English secondary.

**5. Facebook Specialist (Codex)** — Meta Ads expert. Focuses on ticket sales, brand awareness, and Pixel integration. Adheres to Aquastream UI (No Purple). Bilingual: Serbian primary, English secondary.

Coordinate with these agents via the AionUI Team MCP tools or through the bridge at `.agent/bridge/`.
