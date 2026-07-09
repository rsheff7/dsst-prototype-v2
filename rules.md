# DSST Prototype Development Rules & Guidelines

This document outlines key UI, layout, and UX rules for AI coding agents working in this repository. Read this file before making modifications to ensure consistency across mobile and desktop interfaces.

## 1. Viewport & Stickiness Rules (Layout Integrity)
- **Top-Level Navigation**: Global navigation sticky headers are managed exclusively at the page template level (e.g., in `src/app/lesson/page.tsx`).
- **No Nested Stickiness**: Do NOT implement `sticky` or `fixed` positioning on header containers inside inner components (like `MobileQuickRead.tsx`). Inner components must remain static within the main document scroll flow to prevent overlapping/clashing top bars.

## 2. Progressive Disclosure & Toggle Controls
- **Card Headers**: All section-level collapse toggles (like "Hide ▲" / "Show ▼" links) must be aligned inline within the header row of the panel/card itself (using flexbox justify-between next to the section label), not appended as separate text lines at the bottom of the card content.
- **State Separation**: Keep content wrapper conditionals (e.g., `{expanded && ...}`) completely separate from interactive `<button>` tags. Do not wrap paragraph texts inside button boundaries.

## 3. Mobile Scope Constraints
- **Quick Read Priority**: Per current product specs, the mobile experience is restricted strictly to the "Quick Read" view for in-class use. Other desktop views (Pathway, Adapt, etc.) do not require mobile navigation integration.

## 4. CSS Component & Styling Integrity
- **No Ad-Hoc Utility Styling Loops**: Do NOT write custom inline styles or ad-hoc Tailwind classes for structural elements (e.g., moment cards, padding, margins). This causes code clutter and layout bugs.
- **Use Global CSS Utilities**: Reuse or define global component utility classes (like `.moment-card` and `.moment-card-content` in `globals.css`) for standard visual containers.
- **Dynamic Styling Restriction**: Inline `style` properties are reserved strictly for data-driven dynamic attributes (like `style={{ borderLeftColor: frictionColor }}`). All layout, display, width, border width, and border style properties must be defined within CSS class rules.