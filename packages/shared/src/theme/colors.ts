// ──────────────────────────────────────────────────────────────────────────────
// Unified Design Token System — single source of truth for web + mobile
// Merges Member Portal brand palette (mobile) + Material Design 3 (web)
// ──────────────────────────────────────────────────────────────────────────────

export const Colors = {
  // ── Brand (Material Design 3 primary/secondary/tertiary) ──────────────────
  primary:                '#003461',
  onPrimary:              '#ffffff',
  primaryContainer:       '#004b87',
  primaryFixed:           '#d3e4ff',
  primaryFixedDim:        '#a3c9ff',
  onPrimaryContainer:     '#8abcff',

  secondary:              '#00658d',
  onSecondary:            '#ffffff',
  secondaryContainer:     '#41befd',
  secondaryFixed:         '#c6e7ff',
  onSecondaryContainer:   '#004b69',

  tertiary:               '#572500',
  onTertiary:             '#ffffff',
  tertiaryContainer:      '#793701',
  tertiaryFixed:          '#ffdbc8',
  tertiaryFixedDim:       '#ffb68b',
  onTertiaryFixed:        '#321300',
  onTertiaryContainer:    '#ffa46a',

  // ── Surface / Background ──────────────────────────────────────────────────
  background:                   '#f8f9fa',
  surface:                      '#f8f9fa',
  surfaceBright:                '#f8f9fa',
  surfaceDim:                   '#d9dadb',
  surfaceContainerLowest:       '#ffffff',
  surfaceContainerLow:          '#f3f4f5',
  surfaceContainer:             '#edeeef',
  surfaceContainerHigh:         '#e7e8e9',
  surfaceContainerHighest:      '#e1e3e4',

  // ── Text ──────────────────────────────────────────────────────────────────
  onBackground:       '#191c1d',
  onSurface:          '#191c1d',
  onSurfaceVariant:   '#424750',
  textPrimary:        '#111827',
  textSecondary:      '#6B7280',
  textMuted:          '#9CA3AF',
  textOnDark:         '#FFFFFF',
  textOnDarkMuted:    '#CBD5E1',

  // ── Outline / Border ─────────────────────────────────────────────────────
  outline:            '#727781',
  outlineVariant:     '#c2c6d1',
  borderLight:        '#E5E7EB',

  // ── Status / Accent ───────────────────────────────────────────────────────
  error:              '#ba1a1a',
  errorContainer:     '#ffdad6',
  green:              '#22C55E',
  greenBg:            '#DCFCE7',
  orange:             '#EA580C',
  orangeBg:           '#FFF7ED',
  amber:              '#F59E0B',

  // ── Member Portal extended palette (mobile-focused) ───────────────────────
  navyDark:           '#0B1F45',
  navyMid:            '#122158',
  navyLight:          '#1A3072',
  skyBlue:            '#2563EB',
  skyBlueLight:       '#3B82F6',
  bgLight:            '#F5F7FA',
  bgCard:             '#FFFFFF',
  white:              '#FFFFFF',

  // ── Navigation ────────────────────────────────────────────────────────────
  navActive:          '#2563EB',
  navInactive:        '#6B7280',
  navBg:              '#FFFFFF',
  navBorder:          '#E5E7EB',

  // ── Member card ───────────────────────────────────────────────────────────
  memberCardBg:       '#0B1F45',
  memberCardBorder:   '#1E3A7B',

  // ── Plan logo badge ───────────────────────────────────────────────────────
  logoBadgeBg:        '#EFF6FF',
  logoBadgeText:      '#1D4ED8',

  // ── Tinted action icon backgrounds ────────────────────────────────────────
  primaryBg:          '#EEF5FF',   // ultra-light primary (claims/primary icon box)
  secondaryBg:        '#E6F8FA',   // ultra-light secondary (Rx/secondary icon box)
  tertiaryBg:         '#FCF3EB',   // ultra-light tertiary (records/tertiary icon box)

  // ── Extended dark variants ────────────────────────────────────────────────
  primaryDark:        '#003A70',   // darker primary for dark card backgrounds
  blueLight:          '#BFDBFE',   // light blue text on dark primary surfaces

  // ── Status: success green ─────────────────────────────────────────────────
  successBg:          '#E6F4EA',   // light green badge background
  greenText:          '#1E8E3E',   // dark green text on success badges
} as const;

// ── Spacing scale (4px base) ──────────────────────────────────────────────────
export const Spacing = {
  xs:   4,
  sm:   8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;

// ── Border radius ─────────────────────────────────────────────────────────────
export const Radius = {
  sm:   8,
  md:  14,
  lg:  20,
  xl:  28,
  full: 9999,
} as const;

// ── Typography sizes (sp / rem-equivalent) ────────────────────────────────────
export const FontSize = {
  xs:       11,
  sm:       13,
  base:     15,
  md:       16,
  lg:       18,
  xl:       22,
  xxl:      28,
  display:  34,
} as const;
