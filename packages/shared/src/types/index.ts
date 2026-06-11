// ─────────────────────────────────────────────
// Shared TypeScript Interfaces — Dashboard App
// ─────────────────────────────────────────────

export interface HeroData {
  tag: string;
  heading: string;
  subtext: string;
  ctaLabel: string;
  ctaPhone: string;
}

export interface MemberData {
  cardLabel: string;
  insurerName: string;
  name: string;
  memberId: string;
  group: string;
  pcn: string;
}

export interface Copay {
  type: string;
  amount: string;
}

export interface PlanData {
  name: string;
  coverageThrough: string;
  copays: Copay[];
  logos: string[];
  documentUrl: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  statusIcon: string;
  statusColor: string;
  title: string;
  subtitle: string;
  detail: string;
  date: string;
  dateLabel: string;
}

export interface ActionAlert {
  id: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;
  title: string;
  body: string;
  ctaUrl: string;
}

export interface WellnessWisdomData {
  badge: string;
  imageUrl: string;
  title: string;
  description: string;
  buttonText: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export interface ProviderData {
  id: string;
  name: string;
  specialty: string;
  category: string;
  rating: number;
  distance: number;
  photo: string;
  inNetwork: boolean;
  address: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  languages?: string[];
  nextAvailable?: string | null;
  yearsExperience?: number;
  bio?: string;
}

export interface BenefitLineItem {
  label: string;
  value: string;
}

export interface BenefitBreakdownItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  featured: boolean;
  lineItems: BenefitLineItem[];
}

export interface CostItem {
  label: string;
  spent: number;
  total: number;
}

export interface BenefitsData {
  planName: string;
  memberId: string;
  costs: CostItem[];
  breakdown: BenefitBreakdownItem[];
  wellness: {
    imageUrl: string;
    title: string;
    body: string;
  };
}

export interface DiagnosisItem {
  code: string;
  title: string;
  subtitle: string;
}

export interface ServiceItem {
  code: string;
  title: string;
  subtitle: string;
}

export interface JourneyStep {
  step: string;
  date: string;
  complete: boolean;
}

export interface ClaimData {
  id: string;
  provider: string;
  type: string;
  date: string;
  status: string;
  memberResponsibility: number;
  totalBilled: number;
  planDiscount: number;
  insurancePaid: number;
  serviceDate: string;
  category: string;
  doctor: string;
  doctorNpi: string;
  address: string;
  diagnoses: DiagnosisItem[];
  services: ServiceItem[];
  journey: JourneyStep[];
}

export interface ReviewItem {
  initials: string;
  bg: string;
  name: string;
  ago: string;
  stars: number;
  text: string;
}

export interface PrescriptionMed {
  name: string;
  dose: string;
}

export type PrescriptionStatus = 'refill-ready' | 'no-refills';

export interface ActivePrescription {
  name: string;
  dose: string;
  indication: string;
  doctor: string;
  lastFilled: string;
  refills: number;
  status: PrescriptionStatus;
}

export interface PrescriptionsData {
  morning: PrescriptionMed[];
  evening: PrescriptionMed[];
  active: ActivePrescription[];
}

export type CommunicationPreference = 'paper' | 'electronic';

export interface SettingsMember {
  name: string;
  memberId: string;
  address: string;
  phone: string;
}

export interface SettingsPreferences {
  language: string;
  communicationPreference: CommunicationPreference;
  eobPreference: CommunicationPreference;
}

export interface SettingsData {
  member: SettingsMember;
  preferences: SettingsPreferences;
}

export type NotificationType = 'wellness' | 'appointment' | 'claim' | 'security' | 'prescription';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string; // ISO 8601
  read: boolean;
}

export interface DashboardData {
  hero: HeroData;
  member: MemberData;
  plan: PlanData;
  quickActions: QuickAction[];
  recentActivity: ActivityItem[];
  actionAlert: ActionAlert;
  wellnessWisdom?: WellnessWisdomData;
  navigation: NavItem[];
}
