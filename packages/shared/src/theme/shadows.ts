import { Colors } from './colors';

// Shadow presets — import and spread into StyleSheet.create entries.
// All variants are tuned to the brand primary navy so tinted shadows match the palette.
export const Shadows = {
  // Subtle card shadow — white cards on light backgrounds
  card: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  // Very light shadow — list items, inline containers
  light: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  // Heavy shadow — hero sections, feature cards
  deep: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  // Button shadow — primary CTAs
  button: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 8,
    elevation: 3,
  },
  // Elevated card — prominent cards with more depth
  elevated: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.12,
    shadowRadius: 50,
    elevation: 6,
  },
} as const;
