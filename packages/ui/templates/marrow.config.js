/**
 * Marrow UI Configuration
 * =======================
 * This is your single source of truth for customizing Marrow UI.
 * Every setting is documented with its available options.
 *
 * After changing settings, rebuild with: npm run build
 */

module.exports = {

  // ─── THEME MODE ─────────────────────────────────────────────────────
  // Controls the default color scheme.
  // Options: "light" | "dark"
  theme: "dark",

  // ─── COLORS ─────────────────────────────────────────────────────────
  // All colors use HSL format: "H S% L%"
  // This allows easy opacity manipulation via Tailwind (e.g. bg-primary/50).
  //
  // You can use any HSL value. Some popular palettes:
  //   Blue:   "220 90% 56%"    Indigo: "234 89% 74%"
  //   Violet: "263 70% 50%"    Rose:   "347 77% 50%"
  //   Green:  "142 71% 45%"    Orange: "24 95% 53%"
  //   Slate:  "215 16% 47%"    Zinc:   "240 4% 46%"
  colors: {
    light: {
      // Primary brand color (buttons, links, active states)
      primary:            "220 90% 56%",
      primaryForeground:  "0 0% 100%",

      // Secondary color (secondary buttons, subtle accents)
      secondary:          "220 14% 96%",
      secondaryForeground:"220 9% 46%",

      // Accent color (highlights, hover states, decorative elements)
      accent:             "220 14% 96%",
      accentForeground:   "220 9% 46%",

      // Base color (page background)
      background:         "0 0% 100%",
      foreground:         "222 47% 11%",

      // Muted color (disabled states, placeholder text, subtle backgrounds)
      muted:              "220 14% 96%",
      mutedForeground:    "220 9% 46%",

      // Card backgrounds
      card:               "0 0% 100%",
      cardForeground:     "222 47% 11%",

      // Popover/dropdown backgrounds
      popover:            "0 0% 100%",
      popoverForeground:  "222 47% 11%",

      // Destructive/danger color (delete buttons, error states)
      destructive:        "0 84% 60%",
      destructiveForeground: "0 0% 100%",

      // Border and divider color
      border:             "220 13% 91%",

      // Input border color
      input:              "220 13% 91%",

      // Focus ring color
      ring:               "220 90% 56%",

      // Sidebar-specific colors (optional overrides)
      sidebarBackground:   "0 0% 98%",
      sidebarForeground:   "240 5% 34%",
      sidebarBorder:       "220 13% 91%",
      sidebarAccent:       "220 14% 96%",
      sidebarAccentForeground: "222 47% 11%",
      sidebarRing:         "220 90% 56%",
    },
    dark: {
      primary:            "220 90% 56%",
      primaryForeground:  "0 0% 100%",

      secondary:          "217 33% 17%",
      secondaryForeground:"210 40% 98%",

      accent:             "217 33% 17%",
      accentForeground:   "210 40% 98%",

      background:         "222 47% 6%",
      foreground:         "210 40% 98%",

      muted:              "217 33% 17%",
      mutedForeground:    "215 20% 65%",

      card:               "222 47% 8%",
      cardForeground:     "210 40% 98%",

      popover:            "222 47% 8%",
      popoverForeground:  "210 40% 98%",

      destructive:        "0 63% 31%",
      destructiveForeground: "0 0% 100%",

      border:             "217 33% 17%",
      input:              "217 33% 17%",
      ring:               "224 76% 48%",

      sidebarBackground:   "222 47% 8%",
      sidebarForeground:   "215 20% 65%",
      sidebarBorder:       "217 33% 17%",
      sidebarAccent:       "217 33% 17%",
      sidebarAccentForeground: "210 40% 98%",
      sidebarRing:         "224 76% 48%",
    },
  },

  // ─── BORDER RADIUS ──────────────────────────────────────────────────
  // Controls the roundness of all components.
  // Options:
  //   "none"   -> 0px      (sharp square corners)
  //   "sm"     -> 0.25rem  (subtle rounding)
  //   "md"     -> 0.375rem (moderate rounding)
  //   "lg"     -> 0.5rem   (default, balanced)
  //   "xl"     -> 0.75rem  (more rounded)
  //   "2xl"    -> 1rem     (very rounded)
  //   "full"   -> 9999px   (pill shapes)
  //   Or any CSS value like "0.625rem"
  radius: "lg",

  // ─── COMPACTNESS / SIZING ───────────────────────────────────────────
  // Controls the overall density of the UI.
  // This adjusts font sizes, padding, margins, and component sizes globally.
  //
  // Options:
  //   "minimal"  -> text-xs, tight padding    (dashboards, data-heavy UIs)
  //   "compact"  -> text-sm, small padding     (admin panels, productivity tools)
  //   "normal"   -> text-base, standard        (general purpose, default)
  //   "relaxed"  -> text-lg, generous padding  (marketing sites, landing pages)
  //   "spacious" -> text-xl, large padding     (hero sections, editorial)
  compactness: "normal",

  // ─── TYPOGRAPHY ─────────────────────────────────────────────────────
  // Font families for headings and body text.
  // Use any Google Font name or system font stack.
  //
  // Popular combinations:
  //   Heading: "Inter"       Body: "Inter"          (clean, modern)
  //   Heading: "Cal Sans"    Body: "Inter"          (bold + clean)
  //   Heading: "Playfair"    Body: "Source Sans 3"  (editorial)
  //   Heading: "Space Grotesk" Body: "DM Sans"      (techy)
  //   Heading: "system-ui"   Body: "system-ui"      (native, fast)
  fonts: {
    heading: "Inter",
    body: "Inter",
  },

  // ─── MENU ACCENT STYLE ─────────────────────────────────────────────
  // Controls the visual weight of active/selected menu items.
  // Options:
  //   "subtle"  -> Light background highlight only
  //   "bold"    -> Strong background with primary color
  //   "border"  -> Left border accent indicator
  menuAccent: "subtle",

  // ─── ICON LIBRARY ───────────────────────────────────────────────────
  // Which Iconify icon set to use by default.
  // Options (from iconify.design):
  //   "lucide"          -> Clean, consistent (most popular)
  //   "heroicons"       -> Tailwind's official icons
  //   "phosphor"        -> Flexible, 6 weights
  //   "tabler"          -> 4000+ icons, clean
  //   "solar"           -> Modern, bold
  //   "radix-icons"     -> Minimalist
  //   "mdi"             -> Material Design Icons
  //   "carbon"          -> IBM Carbon Design
  //   Or any Iconify set: https://icon-sets.iconify.design/
  iconLibrary: "lucide",

  // ─── TRANSITIONS ────────────────────────────────────────────────────
  // Default transition duration for animations.
  // Options:
  //   "none"  -> 0ms   (no animations)
  //   "fast"  -> 100ms (snappy)
  //   "base"  -> 150ms (default)
  //   "slow"  -> 300ms (smooth)
  //   "lazy"  -> 500ms (dramatic)
  //   Or any CSS duration: "200ms", "0.25s"
  transitionDuration: "base",

  // ─── SHADOW STYLE ───────────────────────────────────────────────────
  // Controls the shadow depth across components.
  // Options:
  //   "none"   -> No shadows (flat design)
  //   "sm"     -> Subtle shadows
  //   "md"     -> Medium shadows (default)
  //   "lg"     -> Pronounced shadows
  //   "xl"     -> Deep shadows (elevated look)
  shadow: "sm",
};
