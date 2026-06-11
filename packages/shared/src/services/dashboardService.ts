import { z } from 'zod';

// ── Zod Schemas ──────────────────────────────────────────────────────────────

const HeroSchema = z.object({
  tag: z.string(),
  heading: z.string(),
  subtext: z.string().optional(),
  greeting: z.string().optional(),
  ctaLabel: z.string(),
  ctaPhone: z.string(),
  conciergeMessage: z.string().optional(),
  aiInsight: z.object({
    titleSuffix: z.string(),
    description: z.string(),
  }).optional(),
});

const MemberSchema = z.object({
  cardLabel: z.string(),
  insurerName: z.string(),
  name: z.string(),
  memberId: z.string(),
  group: z.string(),
  pcn: z.string(),
});

const CopaySchema = z.object({ type: z.string(), amount: z.string() });

const PlanSchema = z.object({
  name: z.string(),
  coverageThrough: z.string(),
  copays: z.array(CopaySchema),
  logos: z.array(z.string()),
  documentUrl: z.string(),
});

const QuickActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.string(),
  color: z.string(),
});

const ActivityItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  statusIcon: z.string(),
  statusColor: z.string(),
  title: z.string(),
  subtitle: z.string(),
  detail: z.string(),
  date: z.string(),
  dateLabel: z.string(),
});

const ActionAlertSchema = z.object({
  id: z.string(),
  icon: z.string(),
  iconColor: z.string(),
  backgroundColor: z.string(),
  title: z.string(),
  body: z.string(),
  ctaUrl: z.string(),
});

const WellnessWisdomSchema = z.object({
  badge: z.string(),
  imageUrl: z.string(),
  title: z.string(),
  description: z.string(),
  buttonText: z.string(),
});

const NavItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.string(),
});

const ReviewItemSchema = z.object({
  initials: z.string(),
  bg: z.string(),
  name: z.string(),
  ago: z.string(),
  stars: z.number(),
  text: z.string(),
});

const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
  category: z.string(),
  rating: z.number(),
  distance: z.number(),
  photo: z.string(),
  inNetwork: z.boolean(),
  address: z.string(),
  coordinate: z.object({ latitude: z.number(), longitude: z.number() }),
  locations: z.array(z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    coordinate: z.object({ latitude: z.number(), longitude: z.number() })
  })).optional(),
  languages: z.array(z.string()).optional(),
  nextAvailable: z.string().nullable().optional(),
  yearsExperience: z.number().optional(),
  bio: z.string().optional(),
  reviews: z.array(ReviewItemSchema).optional(),
});

const BenefitsSchema = z.object({
  planName: z.string(),
  memberId: z.string(),
  costs: z.array(z.object({ label: z.string(), spent: z.number(), total: z.number() })),
  breakdown: z.array(z.object({
    id: z.string(),
    icon: z.string(),
    title: z.string(),
    subtitle: z.string(),
    featured: z.boolean(),
    lineItems: z.array(z.object({ label: z.string(), value: z.string() })),
  })),
  wellness: z.object({ imageUrl: z.string(), title: z.string(), body: z.string() }),
});

const ClaimSchema = z.object({
  id: z.string(),
  provider: z.string(),
  type: z.string(),
  date: z.string(),
  status: z.string(),
  memberResponsibility: z.number(),
  totalBilled: z.number(),
  planDiscount: z.number(),
  insurancePaid: z.number(),
  serviceDate: z.string(),
  category: z.string(),
  doctor: z.string(),
  doctorNpi: z.string(),
  address: z.string(),
  diagnoses: z.array(z.object({ code: z.string(), title: z.string(), subtitle: z.string() })),
  services: z.array(z.object({ code: z.string(), title: z.string(), subtitle: z.string() })),
  journey: z.array(z.object({ step: z.string(), date: z.string(), complete: z.boolean() })),
});

// ── HTTP client ───────────────────────────────────────────────────────────────
// The mobile app injects an Axios instance (apps/mobile/src/services/http.ts)
// with auth interceptors. Web uses native fetch as a fallback.

let _axiosClient: {
  get: (url: string) => Promise<{ data: unknown }>;
  patch: (url: string, data?: unknown) => Promise<{ data: unknown }>;
} | null = null;
// Default base URL — override before first query with setBaseUrl() (web) or
// setHttpClient() (mobile, which carries the base URL inside the Axios instance).
let _baseUrl: string =
  (typeof process !== 'undefined' ? process.env?.EXPO_PUBLIC_API_URL : undefined) ??
  'http://localhost:3001';

/** Inject a pre-configured Axios (or compatible) instance. Mobile uses this. */
export function setHttpClient(client: {
  get: (url: string) => Promise<{ data: unknown }>;
  patch: (url: string, data?: unknown) => Promise<{ data: unknown }>;
}) {
  _axiosClient = client;
}

/** Override the base URL used by the native fetch fallback. Web uses this. */
export function setBaseUrl(url: string) {
  _baseUrl = url;
}

async function fetchJson<S extends z.ZodTypeAny>(path: string, schema: S): Promise<z.infer<S>> {
  let data: unknown;

  if (_axiosClient) {
    const response = await _axiosClient.get(path);
    data = response.data;
  } else {
    const res = await fetch(`${_baseUrl}${path}`);
    if (!res.ok) throw new Error(`Server error ${res.status} on ${path}`);
    data = await res.json();
  }

  return schema.parse(data);
}

async function patchJson<S extends z.ZodTypeAny>(path: string, body: unknown, schema: S): Promise<z.infer<S>> {
  let data: unknown;

  if (_axiosClient) {
    const response = await _axiosClient.patch(path, body);
    data = response.data;
  } else {
    const res = await fetch(`${_baseUrl}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Server error ${res.status} on ${path}`);
    data = await res.json();
  }

  return schema.parse(data);
}

const PrescriptionMedSchema = z.object({
  name: z.string(),
  dose: z.string(),
});

const ActivePrescriptionSchema = z.object({
  name: z.string(),
  dose: z.string(),
  indication: z.string(),
  doctor: z.string(),
  lastFilled: z.string(),
  refills: z.number(),
  status: z.enum(['refill-ready', 'no-refills']),
});

const PrescriptionsSchema = z.object({
  morning: z.array(PrescriptionMedSchema),
  evening: z.array(PrescriptionMedSchema),
  active: z.array(ActivePrescriptionSchema),
});

const NotificationSchema = z.object({
  id: z.string(),
  type: z.enum(['wellness', 'appointment', 'claim', 'security', 'prescription']),
  title: z.string(),
  body: z.string(),
  timestamp: z.string(),
  read: z.boolean(),
});

// ── Exports ───────────────────────────────────────────────────────────────────

export const getHero = () => fetchJson('/hero', HeroSchema);
export const getMember = () => fetchJson('/member', MemberSchema);
export const getPlan = () => fetchJson('/plan', PlanSchema);
export const getQuickActions = () => fetchJson('/quickActions', z.array(QuickActionSchema));
export const getRecentActivity = () => fetchJson('/recentActivity', z.array(ActivityItemSchema));
export const getActionAlert = () => fetchJson('/actionAlert', ActionAlertSchema);
export const getWellnessWisdom = () => fetchJson('/wellnessWisdom', WellnessWisdomSchema);
export const getNavigation = () => fetchJson('/navigation', z.array(NavItemSchema));

export const getBenefits = () => fetchJson('/benefits', BenefitsSchema);

export const getClaims = () => fetchJson('/claims', z.array(ClaimSchema));
export const getClaim = (id: string) => fetchJson(`/claims/${id}`, ClaimSchema);
export const getProvider = (id: string) => fetchJson(`/providers/${id}`, ProviderSchema);
export const getReviews = () => fetchJson('/reviews', z.array(ReviewItemSchema));
export const getPrescriptions = () => fetchJson('/prescriptions', PrescriptionsSchema);

export const getNotifications = () => fetchJson('/notifications', z.array(NotificationSchema));

export const markNotificationRead = (id: string) =>
  patchJson(`/notifications/${id}/read`, {}, z.object({ id: z.string(), read: z.boolean() }));

const SettingsMemberSchema = z.object({
  name: z.string(),
  memberId: z.string(),
  address: z.string(),
  phone: z.string(),
});

const SettingsPreferencesSchema = z.object({
  language: z.string(),
  communicationPreference: z.enum(['paper', 'electronic']),
  eobPreference: z.enum(['paper', 'electronic']),
});

const SettingsSchema = z.object({
  member: SettingsMemberSchema,
  preferences: SettingsPreferencesSchema,
});

export const getSettings = () => fetchJson('/settings', SettingsSchema);

export const patchSettingsMember = (body: Partial<z.infer<typeof SettingsMemberSchema>>) =>
  patchJson('/settings/member', body, SettingsMemberSchema);

export const patchSettingsPreferences = (body: Partial<z.infer<typeof SettingsPreferencesSchema>>) =>
  patchJson('/settings/preferences', body, SettingsPreferencesSchema);

export const getProviders = (params: {
  category?: string;
  maxDistance?: number;
  name?: string;
} = {}): Promise<z.infer<typeof ProviderSchema>[]> => {
  const q = new URLSearchParams();
  if (params.category && params.category !== 'All') q.set('category', params.category);
  if (params.maxDistance != null) q.set('maxDistance', String(params.maxDistance));
  if (params.name) q.set('name', params.name);
  const qs = q.toString();
  return fetchJson(`/providers${qs ? `?${qs}` : ''}`, z.array(ProviderSchema));
};
