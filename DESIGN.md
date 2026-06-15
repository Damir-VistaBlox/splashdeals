# 🌊 Design System: Splashdeals (Aquastream Pro Max)

> **Status**: Exhaustive Source of Truth v1.2  
> **Aesthetic**: Immersive Hydro-Premium  
> **Framework**: Next.js 16 (PPR) + Aquastream UI

---

## 1. Visual Theme & Atmosphere
The **Aquastream Pro Max** visual language is a meticulously crafted "Hydro-Premium" aesthetic. It moves beyond standard fintech or marketplace designs into a sensory, experience-driven interface that mirrors the physical sensation of a luxury water park.

*   **Vibe**: Immersive, Vibrant, and Fluid.
*   **Depth Strategy**: Z-axis layering using high-refraction glass and ambient background "orbs" to create a sense of floating interfaces.
*   **Density**: 
    *   **(web)**: High-density marketplace layouts. High information volume with premium padding.
    *   **(mob)**: PWA-first. High-performance touch targets and bottom-sheet navigation.
    *   **(admin)**: Utilitarian. Data-dense tables and charts using the same premium glass aesthetic.

---

## 2. 🎨 The Color Universe
> [!CAUTION]
> **STRICT PURPLE BAN**: The use of violet, indigo, or purple hues is a protocol violation. All cool-tone gradients must transition through Cyan, Teal, or Azure.

### Core Brand Tokens
| Token | Hex/Value | Role |
| :--- | :--- | :--- |
| **Void Navy** | `#020617` | Root background. The "Deep End" of the UI. |
| **Electric Cyan** | `#06b6d4` | Primary Action. Digital water spark. |
| **Azure Glow** | `#22d3ee` | Interactive hover states and selection rings. |
| **Splash Amber** | `#f59e0b` | Urgency, "Limited Offer" badges, and conversion triggers. |
| **Slate Mist** | `#f8fafc` | Primary Text (100%) and Secondary labels (400-500). |
| **Toxic Emerald**| `#10b981` | Success states and verified purchase badges. |

### Glassmorphism Specification
*   **Base Surface**: `rgba(15, 23, 42, 0.25)` to `rgba(15, 23, 42, 0.85)`.
*   **Backdrop Filter**: `blur(12px) saturate(180%)`.
*   **Border**: `1px solid rgba(255, 255, 255, 0.1)`.
*   **Top Reflection**: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)`.

---

## 3. ⌨️ Typography & Hierarchy
All typography must feel "Machine-Chiseled" and precise.

*   **Primary Typeface**: `Geist Sans` (Variable).
*   **Mono Typeface**: `Geist Mono` (For IDs, serials, and pricing).
*   **Headline Protocol**:
    *   Weight: `font-black` (900).
    *   Tracking: `tracking-tighter` (-0.05em).
    *   Style: Optional `italic` for high-energy sections.
    *   Gradient: Use `text-splash` utility (Cyan to White gradient) for H1s.
*   **Body Protocol**:
    *   Primary: `text-slate-100` / `font-medium`.
    *   Secondary: `text-slate-400` / `font-normal`.
    *   Leading: `leading-relaxed` (1.625) for descriptive text.

---

## 4. 🧩 Component Patterns
### GlassCard (The Foundation)
*   **Border Radius**: `rounded-[2rem]` for main containers; `rounded-xl` for inner elements.
*   **Interaction**: On hover, elevate using `hover:-translate-y-1` and increase `border-opacity` from `0.1` to `0.3`.
*   **Shadow**: `shadow-2xl shadow-cyan-500/10` (Ambient cyan glow).

### LiquidButton
*   **Style**: Full-gloss gradient (`splash-gradient`).
*   **Effect**: Scale on click (`active:scale-95`).
*   **Pulse**: Ambient cyan pulse animation when a primary action is required.

### Skeletons (The Protocol)
*   **CLS Zero**: Fallback skeletons must mirror the final DOM structure exactly.
*   **Animation**: `animate-pulse` with `bg-slate-900/50`.

---

## 5. ✨ Motion & Micro-animations
Motion is not an afterthought; it is the "Liquid" in Aquastream.

*   **Library**: `framer-motion`.
*   **Transitions**:
    *   **Entrance**: `initial: { opacity: 0, y: 20 }` -> `animate: { opacity: 1, y: 0 }`.
    *   **Springs**: Use `type: "spring", stiffness: 300, damping: 30` for a snappier, premium feel.
*   **Hover States**: Subtle scaling (`1.02x`) and color shifts.
*   **Heavy Mutations**: All actions must use `useTransition` to maintain UI responsiveness <100ms.

---

## 6. 📱 Responsive & Domain Nuances
### (mob) PWA Strategy
*   **Bottom Sheet**: Use for all complex filters and ticket configuration.
*   **Touch Targets**: Minimum `48px x 48px` for all clickable areas.
*   **Vibrancy**: Higher saturation for outdoor (sunny) readability.

### (web) Marketplace Strategy
*   **Density**: High-density ticket grids (4 columns on desktop).
*   **Global Ambient**: Use `GlobalAmbient` component to inject moving cyan orbs behind the layout.

### (admin) Management Strategy
*   **Density**: Maximum data density. Small font sizes (`text-xs`) with high-contrast `Geist Mono` for financial values.
*   **Navigation**: Side-nav with collapsed state to maximize data real-estate.

---

## 7. 🛡️ Data & Technical Constraints
*   **Decimal Safety**: Prisma `Decimal` must be serialized to `number` or `string` before reaching Client Components.
*   **PPR Boundaries**: Always wrap dynamic fetches in `<Suspense>` with high-fidelity skeletons.
*   **SEO & GEO**:
    *   Semantic tags only (`<article>`, `<section>`, `<nav>`).
    *   Mandatory `JSON-LD` for all Product (Ticket) and Organization pages.

---

## 8. 🖼️ Iconography Spec
*   **Library**: `Lucide-React`.
*   **Weight**: `stroke-width={1.5}` for a refined, modern look.
*   **Scaling**: Standardize on `16px` for inline, `24px` for headers, `32px+` for features.
*   **Color**: Use `text-cyan-500` for active/brand icons; `text-slate-500` for neutral icons.

---
*Created by Antigravity Design Agent.*
