import { Colors, FontSize } from './colors';

// Typography presets — import and spread into StyleSheet.create entries.
// Use `as const` so TypeScript infers literal fontWeight values correctly.
export const Typography = {
  // UPPERCASE micro-label above headings
  overline: {
    fontSize: FontSize.xs,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    color: Colors.onSurfaceVariant,
  },
  // Tiny all-caps table/field label
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
    color: Colors.onSurfaceVariant,
  },
  // Secondary body (captions, subtitles)
  caption: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  // Primary body text
  body: {
    fontSize: FontSize.base,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  // Section heading inside cards/pages
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '800' as const,
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  // Large card title / member name
  cardTitle: {
    fontSize: FontSize.xl,
    fontWeight: '900' as const,
    color: Colors.primary,
  },
  // Page-level display heading
  pageTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800' as const,
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  // White heading on dark surfaces
  onDarkTitle: {
    fontSize: FontSize.xl,
    fontWeight: '900' as const,
    color: Colors.white,
  },
  // White body text on dark surfaces
  onDarkBody: {
    fontSize: FontSize.base,
    color: Colors.white,
    lineHeight: 20,
  },
  // Muted white text on dark surfaces
  onDarkMuted: {
    fontSize: FontSize.sm,
    color: Colors.textOnDarkMuted,
  },
} as const;
