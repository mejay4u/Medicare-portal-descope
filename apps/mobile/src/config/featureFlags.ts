const flags = {
  /** Show/hide the Email ID Card button on the digital member card. */
  ID_CARD_EMAIL: process.env.EXPO_PUBLIC_FF_ID_CARD_EMAIL !== 'false',

  /** Show/hide the AI Concierge panel on the dashboard. */
  AI_CONCIERGE: process.env.EXPO_PUBLIC_FF_AI_CONCIERGE !== 'false',

  /** Show/hide the Wellness Wisdom section on the dashboard. */
  WELLNESS_WISDOM: process.env.EXPO_PUBLIC_FF_WELLNESS_WISDOM !== 'false',
} as const;

export default flags;
