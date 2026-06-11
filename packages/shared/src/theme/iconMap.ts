// Platform-agnostic icon key mapping — each app maps keys to its own icon library.
// Mobile uses @expo/vector-icons (MaterialCommunityIcons); web uses Material Symbols.

export const QUICK_ACTION_ICON_MAP: Record<string, { mobile: string; web: string }> = {
  'find-doctor':  { mobile: 'account-search-outline', web: 'manage_search'   },
  'refill-rx':    { mobile: 'pill',                   web: 'medication'       },
  'view-claims':  { mobile: 'file-document-outline',  web: 'request_quote'    },
  'contact':      { mobile: 'help-circle-outline',    web: 'support_agent'    },
  'medical-bag':  { mobile: 'medical-bag',            web: 'medical_services' },
};

export const ACTIVITY_ICON_MAP: Record<string, { mobile: string; web: string }> = {
  'check-circle':    { mobile: 'check-circle',    web: 'check_circle'   },
  'calendar-clock':  { mobile: 'calendar-clock',  web: 'event_available' },
  'alert-circle':    { mobile: 'alert-circle',    web: 'error'           },
  'pill':            { mobile: 'pill',             web: 'medication'      },
};

export const NAV_ICON_MAP: Record<string, { mobile: string; web: string }> = {
  'view-dashboard-outline': { mobile: 'view-dashboard-outline', web: 'dashboard'     },
  'map-marker-outline':     { mobile: 'map-marker-outline',     web: 'location_on'   },
  'shield-outline':         { mobile: 'shield-outline',         web: 'verified_user' },
  'pill':                   { mobile: 'pill',                   web: 'medication'     },
};
