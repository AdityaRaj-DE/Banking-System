---
name: Digital Banking Design System
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#474553'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#787584'
  outline-variant: '#c8c4d5'
  surface-tint: '#574ebf'
  primary: '#35299d'
  on-primary: '#ffffff'
  primary-container: '#4d44b5'
  on-primary-container: '#c8c4ff'
  inverse-primary: '#c5c0ff'
  secondary: '#5d5c76'
  on-secondary: '#ffffff'
  secondary-container: '#e0dcfb'
  on-secondary-container: '#62607a'
  tertiary: '#004900'
  on-tertiary: '#ffffff'
  tertiary-container: '#15630e'
  on-tertiary-container: '#8ede7b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c5c0ff'
  on-primary-fixed: '#130068'
  on-primary-fixed-variant: '#3e34a6'
  secondary-fixed: '#e3dffe'
  secondary-fixed-dim: '#c7c3e2'
  on-secondary-fixed: '#1a1930'
  on-secondary-fixed-variant: '#46445d'
  tertiary-fixed: '#a5f791'
  tertiary-fixed-dim: '#8ada77'
  on-tertiary-fixed: '#002200'
  on-tertiary-fixed-variant: '#005300'
  background: '#faf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
typography:
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-bold:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  numeric-display:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 24px
  margin-page: 40px
  card-padding: 24px
  stack-sm: 8px
  stack-md: 16px
---

## Brand & Style

This design system is engineered for the next generation of personal finance, blending the reliability of traditional banking with the agility of modern fintech. The aesthetic is categorized as **Corporate Modern with a Minimalist focus**, prioritizing high-density information display without sacrificing breathing room. 

The visual narrative centers on "Precision and Prosperity." By utilizing a restrained color palette and a structured card-based architecture, the interface fosters a sense of security and clarity. The target audience expects immediate access to liquid assets and transaction history, presented through a lens of sophisticated, understated luxury.

## Colors

The color strategy for this design system utilizes high-contrast pairings to drive user focus toward actionable financial data.

*   **Primary (#4D44B5):** A vibrant Indigo used for primary actions, active states, and brand-critical touchpoints. It represents innovation.
*   **Secondary (#0D0C22):** A deep Midnight Navy used for primary typography and navigation backgrounds. This provides the "weight" and "trust" necessary for a financial institution.
*   **Tertiary (#015701):** A classic Forest Green reserved specifically for "Success" states, positive balance trends, and completed transactions.
*   **Neutral (#F3F2EF):** A warm, off-white "Bone" color used for the global background to reduce eye strain compared to pure white, while #FFFFFF is reserved for card surfaces to create depth.

## Typography

The typography is powered by **Manrope**, a geometric sans-serif that excels in numerical clarity—essential for a banking dashboard. 

The system uses a strict hierarchy: Large headlines for account overviews, semi-bold weights for transaction titles, and specialized uppercase labels for metadata (e.g., timestamps, categories). Numeric values are often set with slightly tighter letter spacing to maintain a compact, "ticker-tape" feel in transaction lists.

## Layout & Spacing

This design system employs a **Fixed Grid with Fluid Internal Components**. The main content area is capped at 1440px to ensure readability on ultra-wide monitors.

The layout follows a 12-column structure for the main dashboard content, while the sidebar remains a fixed 280px. Content is organized into "Financial Modules" (cards). Spacing follows an 8px base unit, with 24px being the standard gutter between cards to maintain a high-end, spacious feel.

## Elevation & Depth

To achieve a clean and professional look, the design system avoids heavy, muddy shadows. Instead, it uses **Tonal Layering and Soft Ambient Shadows**.

1.  **Level 0 (Background):** The Neutral (#F3F2EF) base layer.
2.  **Level 1 (Cards):** Pure White (#FFFFFF) surfaces with a subtle, highly diffused shadow (0px 4px 20px rgba(13, 12, 34, 0.04)).
3.  **Level 2 (Dropdowns/Modals):** Pure White with a more defined shadow (0px 8px 30px rgba(13, 12, 34, 0.08)) and a 1px border using the neutral color at 50% opacity.

This approach creates a "layered paper" effect that feels tactile yet digital.

## Shapes

The design system utilizes **Rounded (0.5rem)** corners as the standard for all core components. This provides a approachable and modern feel while remaining professional enough for a bank.

*   **Standard Cards/Inputs:** 16px (1rem) corner radius to create a soft, containerized look.
*   **Buttons:** 8px (0.5rem) to maintain a sense of structural integrity.
*   **Status Chips:** Fully rounded (pill-shaped) to distinguish them from interactive buttons.

## Components

### Buttons
*   **Primary:** Solid Indigo (#4D44B5) with White text. No gradients.
*   **Secondary:** Ghost style with a 1px Midnight Navy border and Midnight Navy text.

### Cards
Cards are the primary organizational unit. Every card must have a white background, 24px internal padding, and a 16px corner radius. Group related data (e.g., "Total Balance" vs "Quick Transfer") within separate cards to maintain cognitive ease.

### Inputs
Text fields use a light gray background (a 5% tint of the Primary color) with no border in their default state, shifting to a 2px Indigo border on focus. Labels always sit above the field in the `label-bold` style.

### Transaction Lists
List items should utilize 16px vertical padding with a thin 1px horizontal separator (#F3F2EF). Icons for transactions should be contained within a 40px circular background using a 10% opacity version of the transaction category color.

### Data Visualization
Charts should use the Primary color for main data lines and Tertiary Green for growth indicators. Use "Inter" style thin lines for grid axes to keep the focus on the data points.