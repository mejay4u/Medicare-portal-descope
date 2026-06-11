const flags = {
  /** Show/hide the Email ID Card button and panel on the member ID card. */
  ID_CARD_EMAIL: import.meta.env.VITE_FF_ID_CARD_EMAIL !== 'false',
} as const;

export default flags;
