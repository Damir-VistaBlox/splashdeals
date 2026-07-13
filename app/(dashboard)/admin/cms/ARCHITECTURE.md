# CMS Module — Architecture & Implementation

## Overview

Enterprise-grade CMS system for Splashdeals.rs, modeled after WordPress editorial workflows. Supports blog posts, static pages, categories, tags, content revisions, SEO metadata, rich text editing, scheduled publishing, and frontend blog delivery.

Built on: Next.js 16 App Router, Prisma (PostgreSQL), ShadCN UI (radix-nova), TipTap editor, Zod v4.

---

## Route Structure

### Admin (under `(dashboard)` route group)

The CMS admin routes are organized into **route groups** (`(content)`, `(engagement)`, `(settings)`, `(tools)`) to provide logical organization without changing any URLs. Route groups (parenthesized directories) are invisible in the URL path.

```
/admin/cms
├── page.tsx                    → redirects to /admin/cms/posts
├── error.tsx                   → error boundary
├── loading.tsx                 → AdminSkeleton
├── _components/
│   ├── rich-text-editor.tsx    → TipTap editor with toolbar + image upload plugin
│   ├── seo-panel.tsx           → SERP preview, OG fields, canonical, robots
│   └── image-upload-plugin.ts  → TipTap plugin for drag-drop/paste upload
│
├── (content)/                  ← route group — invisible in URL
│   ├── posts/
│   │   ├── page.tsx                → Server component (fetches + serializes posts)
│   │   ├── loading.tsx / error.tsx
│   │   ├── _components/
│   │   │   ├── posts-list-client.tsx  → TanStack table with filters, pagination, bulk ops
│   │   │   └── post-editor.tsx        → Full form: title, slug, content, tags, SEO, publish
│   │   ├── new/page.tsx             → Server page + PostEditor (no post prop)
│   │   └── [post-id]/page.tsx       → Server page + PostEditor (with post prop)
│   ├── pages/
│   │   ├── page.tsx                 → Server component (fetches + serializes pages)
│   │   ├── _components/
│   │   │   ├── pages-list-client.tsx → Table with filters
│   │   │   └── page-editor.tsx       → Form: title, slug, content, template, header/footer toggles
│   │   ├── new/page.tsx
│   │   └── [page-id]/page.tsx
│   ├── categories/
│   │   ├── page.tsx                 → Server component
│   │   └── _components/
│   │       └── categories-manager.tsx  → Inline CRUD with color picker, post count
│   └── tags/
│       ├── page.tsx                 → Server component
│       └── _components/
│           └── tags-manager.tsx        → Inline CRUD (SUPER_ADMIN only)
│
├── (engagement)/               ← route group — invisible in URL
│   ├── reviews/
│   ├── activity/
│   └── campaigns/
│
├── (settings)/                 ← route group — invisible in URL
│   ├── navigation/
│   ├── webhooks/
│   └── redirects/
│
└── (tools)/                    ← route group — invisible in URL
    ├── api-docs/
    ├── orphaned-media/
    └── embed/
```

### Public (under `(web)` route group)

```
/blog
├── page.tsx                     → Paginated grid (12/post), category badges, reading time
└── [slug]/page.tsx              → Full article + related posts + Article JSON-LD + OG + canonical
```

### Cron / API

```
/(server)/api/cron/publish-blog/route.ts   → Vercel Cron (every 10min), publishes DRAFTs with past publishedAt
```

### Sitemap / RSS

```
/sitemap.ts                      → Blog posts added alongside facilities
/blog/feed.xml/route.ts          → RSS 2.0 feed (50 latest posts)
/robots.ts                       → References sitemap + RSS feed
```

---

## Database Schema (all in `marketing` schema)

### BlogPost
| Field | Type | Purpose |
|-------|------|---------|
| id | uuid | PK |
| title | String | Display title |
| slug | String (unique) | URL path |
| content | Text | HTML from TipTap editor |
| excerpt | Text? | Short summary for lists |
| coverImage / featuredImage | String? | Hero images |
| author | String? | Display name |
| publishedAt | DateTime? | Publish date |
| status | PostStatus enum | DRAFT / PUBLISHED / ARCHIVED |
| categoryId | String? | FK → BlogCategory |
| isFeatured | Boolean | Starred post |
| readingTime | Int | Auto-calculated minutes |
| metaTitle, metaDescription, ogTitle, ogDescription, ogImage | String? | SEO fields |
| canonicalUrl | String? | Custom canonical |
| robotsDirective | String? | noindex/nofollow override |
| schemaMarkup | Json? | Custom JSON-LD |

### BlogPostRevision
| Field | Type | Purpose |
|-------|------|---------|
| id | uuid | PK |
| postId | String | FK → BlogPost (cascade) |
| title | String | Snapshot of title at publish |
| content | Text | Snapshot of content at publish |
| excerpt | Text? | Snapshot of excerpt |
| createdAt | DateTime | Auto timestamp |
| createdBy | String? | User ID |

### BlogCategory
| Field | Type |
|-------|------|
| id, name, slug (unique), description, color (hex), displayOrder |

### BlogTag
| Field | Type |
|-------|------|
| id, name (unique), slug (unique) |

### BlogPostTag (junction)
| Field | Type |
|-------|------|
| postId + tagId (composite PK) |

### Page
Same SEO fields as BlogPost + `template` (default/full-width/landing), `showHeader`, `showFooter` booleans.

---

## Server Actions

The monolithic `app/(server)/actions/cms.ts` has been split into **domain-specific files** under `app/(server)/actions/cms/`:

### File Structure

```
app/(server)/actions/cms/
├── content.ts          → Posts, pages, categories, tags CRUD + bulk ops + review workflow
├── engagement.ts       → Re-exports reviews, activity, campaigns actions
├── settings.ts         → Re-exports navigation, redirects, webhooks actions
└── tools.ts            → Orphan pages, broken link checker, 404 monitoring
```

The original `app/(server)/actions/cms.ts` is kept as a barrel file re-exporting from all four domain files for backward compatibility.

### `content.ts` — Content CRUD

#### Blog Post Actions
- `createBlogPostAction(data, tagIds?)` — creates post + optional tag relations + initial revision on publish
- `updateBlogPostAction(id, data, tagIds?, expectedVersion?)` — updates post + reconnects tags + saves revision on publish + auto-redirect on slug change
- `deleteBlogPostAction(id)` — SUPER_ADMIN only
- `getBlogPostAction(id)` — returns post + category + tagIds
- `listBlogPostsAction()` — returns posts with category + tag count
- `getBlogPostRevisionsAction(postId)` — lists revisions with timestamps
- `getBlogPostRevisionAction(id)` — gets single revision content

#### Page Actions
- `createPageAction(data)` — creates page + webhook
- `updatePageAction(id, data, expectedVersion?)` — updates page with conflict check
- `deletePageAction(id)` — SUPER_ADMIN only
- `getPageAction(id)` — returns page by id
- `listPagesAction()` — returns all pages

#### Category Actions
- `createCategoryAction(data)` — creates category
- `updateCategoryAction(id, data)` — updates category
- `deleteCategoryAction(id)` — SUPER_ADMIN; nullifies categoryId on posts
- `listCategoriesAction()` — returns categories with post count

#### Tag Actions
- `createTagAction(data)` — SUPER_ADMIN only
- `updateTagAction(id, data)` — SUPER_ADMIN only
- `deleteTagAction(id)` — SUPER_ADMIN only
- `listTagsAction()` — returns tags with post count

#### Bulk & Workflow Actions
- `bulkUpdateBlogPostsAction(ids[], status)` — batch publish/draft/archive
- `bulkDeleteBlogPostsAction(ids[])` — batch delete (SUPER_ADMIN)
- `markAsReviewedAction(ids[], type)` — marks posts/pages as reviewed
- `submitForReviewAction(id, type)` — submits for review workflow
- `approvePostAction(id, type)` — approves and publishes
- `rejectPostAction(id, type)` — rejects back to DRAFT

#### Utilities
- `calculateReadingTime(html)` — strips HTML, counts words, divides by 200
- `getFacilityNamesAction()` — returns facility names for internal link suggestions

### `tools.ts` — CMS Tools
- `getOrphanPagesAction()` — finds published pages/posts with no internal links
- `checkBrokenLinksAction()` — checks external links in published content (HEAD requests)
- `getNotFoundLogsAction()` — returns 404 log entries
- `clearNotFoundLogAction(id)` — clears a single 404 log entry

### `engagement.ts` — Barrel Re-exports
Re-exports from:
- `@/app/(server)/actions/reviews` (`approveReviewAction`, `deleteReviewAction`)
- `@/app/(server)/actions/activity` (`getActivityLogAction`)
- `@/app/(server)/actions/campaigns` (`createCampaignAction`, `deleteCampaignAction`, `updateCampaignAction`)

### `settings.ts` — Barrel Re-exports
Re-exports from:
- `@/app/(server)/actions/navigation` (menu/section/item CRUD, reorder, discovery)
- `@/app/(server)/actions/redirects` (CRUD + toggle)
- `@/app/(server)/actions/webhooks` (CRUD, test, reactivate, logs, events constant)

### Import Note

Route files import from the domain-specific files (e.g., `@/app/(server)/actions/cms/content`). The barrel file `@/app/(server)/actions/cms` remains available for convenience but new code should prefer the domain-specific imports.

---

## Zod v4 Validation

All schemas use `.optional()` on non-required fields to avoid runtime type mismatches. Schemas use `z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"])` for status. Slug validation: `/^[a-z0-9-]+$/`.

**Important:** Zod v4 `.safeExtend()` must be used instead of `.extend()` when extending schemas with `.refine()`. Current schemas don't use refinements, so this isn't an issue yet.

---

## Key Conventions

1. **Serbian-only admin** — all labels, placeholders, toasts, and error messages are in Serbian
2. **ShadCN theme tokens only** — no hardcoded hex colors
3. **No `setState` in `useEffect`** — React Compiler lint rule; derived state pattern used
4. **No Prisma Decimal spread** — CMS models use only String/Text/Boolean types, no Decimal fields to serialize
5. **Route groups for organization** — `(content)`, `(engagement)`, `(settings)`, `(tools)` groups organize the CMS admin without affecting URLs
6. **`@ts-nocheck` on editor files** — react-hook-form + Zod v4 resolver has type chain incompatibility; runtime is correct

---

## NPM Dependencies Added

- `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/pm`
- `slugify` — auto-generate slugs from titles
- `reading-time` — calculate reading duration from content

---

## Future Enhancements

- **Preview mode:** `/blog/preview/[token]` route that shows draft content via Next.js Draft Mode
- **Media library:** Centralized image browser with thumbnails in TipTap toolbar
- **Sitemap video fix:** Blog posts with video content can get VideoObject schema
- **Related posts model:** `BlogPostRelation` for manual editor-curated related posts
- **Content diff viewer:** Side-by-side diff between revisions
- **Auto-save drafts:** Debounced save to revisions table every 60s while editing
