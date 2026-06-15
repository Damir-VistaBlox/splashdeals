# 🌊 Splashdeals DevOps & Infrastructure

This document outlines the infrastructure, deployment, and operational procedures for Splashdeals.

## 🏗️ Architecture Overview

| Component | Provider | Description |
|-----------|----------|-------------|
| **Frontend/App** | Vercel | Next.js 16 (PPR) application. |
| **Database** | Neon | Serverless PostgreSQL (Multi-schema: `admin`, `partners`, `sales`, `public`). |
| **Authentication** | Better Auth | Integrated with Prisma adapter. |
| **Payments** | Stripe | Handles transactions and subscriptions. |
| **Media Storage** | Vercel Blob | For assets and ticket media. |
| **Email/QR** | Nodemailer | SMTP-based delivery for QR tickets. |

## 🚀 Deployment Process

### Production
- **Branch**: `master` (or `main`)
- **Pipeline**: Vercel Git Integration
- **Verification**: `python3 .agent/scripts/checklist.py .` must pass before merge.

### Staging/Preview
- Automatically deployed by Vercel on all non-production branches.
- Used for E2E testing via Playwright.

## 🔐 Environment Variables

Required variables are documented in `.env.example`. 
**Critical Secrets**:
- `DATABASE_URL`: Neon connection string.
- `STRIPE_SECRET_KEY`: Stripe API access.
- `STRIPE_WEBHOOK_SECRET`: For atomic fulfillment verification.
- `BETTER_AUTH_SECRET`: For session security.

## 🛡️ Edge Operations (`proxy.ts`)

Splashdeals uses a custom `proxy.ts` instead of standard `middleware.ts`. This handles:
1. **Canonical Routing**: Apex (splashdeals.rs) to WWW (www.splashdeals.rs).
2. **i18n Cleanup**: Removal of legacy `/en` or `/rs` prefixes.
3. **Lite Auth**: Fast session checks for `/admin` routes at the edge.
4. **Affiliate Tracking**: `ref` parameter cookie injection.

## 🧪 Quality Assurance

### Validation Scripts
Located in `.agent/scripts/`:
- `checklist.py`: Core validation (Security, Lint, Schema, Tests, UX, SEO).
- `verify_all.py`: Comprehensive suite including Lighthouse and Playwright.

### Linting & Types
- **Linter**: ESLint (Next.js 16 config).
- **Type Checker**: TypeScript (`tsc --noEmit`).
- **Goal**: Zero errors. Warnings should be addressed during refactors.

## 📈 Monitoring & Maintenance

- **Uptime**: Monitored via Vercel/Neon dashboards.
- **Crons**: `vercel.json` defines a daily session cleanup cron at `/api/cron/cleanup-sessions`.
- **Database Migrations**: Handled via `npx prisma migrate deploy` in the build step.

---
*Maintained by the DevOps Engineer agent.*
