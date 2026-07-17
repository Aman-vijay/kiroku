---
name: Kiroku
description: Daily progress, beautifully shared — restrained product UI
colors:
  bg: "#ffffff"
  surface: "#f4f4f7"
  ink: "#14121f"
  muted: "#5c586e"
  primary: "#4f46a8"
  primary-deep: "#3b3480"
  primary-fg: "#ffffff"
  accent: "#e05a3c"
  accent-fg: "#ffffff"
  line: "#e4e2ec"
  ring: "#6d64c8"
  danger: "#c43c3c"
  success: "#1f7a4c"
  bg-dark: "#0c0b10"
  surface-dark: "#16151c"
  ink-dark: "#f2f0f7"
  muted-dark: "#a8a3b8"
  line-dark: "#2a2833"
typography:
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  display:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  label:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.35
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-fg}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.primary-fg}"
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-fg}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

## Overview

Kiroku’s visual system is a **restrained product UI**: pure white (or near-black) surfaces, indigo primary for actions, coral accent sparingly for “share / highlight” moments. Typography is a single sans family (DM Sans) across product and marketing so app and landing feel like one product. Density is comfortable for forms and lists; personality is reserved for future card templates, not chrome.

Mood phrase: **desk lamp at 11pm — private log, phone ready to post.**

Color strategy: **Restrained** (accent ≤10% of surface).

## Colors

| Role | Light (OKLCH) | Hex | Use |
|------|---------------|-----|-----|
| bg | `oklch(1 0 0)` | `#ffffff` | Page background |
| surface | `oklch(0.965 0.008 285)` | `#f4f4f7` | Panels, header wash |
| ink | `oklch(0.22 0.03 285)` | `#14121f` | Body text |
| muted | `oklch(0.48 0.03 285)` | `#5c586e` | Secondary text |
| primary | `oklch(0.48 0.14 285)` | `#4f46a8` | Primary buttons, links |
| primary-deep | `oklch(0.40 0.12 285)` | `#3b3480` | Primary hover |
| accent | `oklch(0.62 0.17 35)` | `#e05a3c` | Share / emphasis CTAs only |
| line | `oklch(0.91 0.01 285)` | `#e4e2ec` | Borders |
| ring | `oklch(0.58 0.12 285)` | `#6d64c8` | Focus rings |

Dark mode mirrors the same roles on pure near-black `oklch(0.14 0.01 285)` without tinted “night teal.”

Text on primary and accent fills is always **white**.

## Typography

- **Family:** DM Sans only (product register — no display serif in UI labels).  
- **Scale:** ~1.2 ratio — 12 / 14 / 16 / 20 / 28 / 36.  
- **Headings:** weight 600–650, letter-spacing ≥ -0.03em (never tighter than -0.04em).  
- **Body:** 16px / 1.55; max measure ~65ch for marketing prose.  
- **`text-wrap: balance`** on h1–h2.

## Elevation

- Prefer **1px border** (`line`) over heavy shadows.  
- Optional shadow: `0 1px 2px oklch(0.2 0.02 285 / 0.06)` max blur ~8px.  
- Never combine thick border + large soft shadow (ghost-card ban).  
- Radius: 6 / 10 / 14; pills only for chips and toggles — not large panels.

## Components

- **Primary button:** solid primary, white text, md radius, hover → primary-deep.  
- **Secondary button:** bg surface or white, ink text, 1px line border.  
- **Accent button:** coral fill — only share / high-emphasis actions.  
- **Input:** white bg, line border, focus ring 2px ring color, md radius.  
- **Panel:** surface bg, 1px line, lg radius, no glass blur.  
- **Nav link:** muted → ink on hover/active; active = weight 600 + primary underline 2px (not gradient).  
- **States required:** default, hover, focus-visible, disabled (opacity 0.5 + no pointer), loading, error.

## Do's and Don'ts

**Do**

- Keep page backgrounds pure white / near-black.  
- Use primary for the single main action on a screen.  
- Put template personality into share cards later, not app chrome.  
- Prefer semantic tokens (`bg-ink`, `text-muted`) over hard-coded hex in components.

**Don't**

- Cream/sand/lagoon tropical backgrounds or decorative grid overlays.  
- Glassmorphism panels, gradient text, side-stripe accents.  
- Identical icon+title+body marketing card grids as the main story.  
- Eyebrow kickers on every section.  
- 24–40px radii on forms and content panels.  
