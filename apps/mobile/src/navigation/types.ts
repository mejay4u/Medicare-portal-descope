import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

// ── Root stack (Auth vs App) ────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

// ── App stack (tabs + modal-style screens above tabs) ────────────────────────

export type AppStackParamList = {
  TabHome: NavigatorScreenParams<TabParamList>;
  Notifications: undefined;
  Settings: undefined;
  History: undefined;
  CaribearChat: undefined;
};

// ── Auth stack ───────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// ── Main tab navigator ───────────────────────────────────────────────────────

export type TabParamList = {
  Dashboard: undefined;
  FindCare: NavigatorScreenParams<FindCareStackParamList>;
  Benefits: undefined;
  Prescriptions: undefined;
  Claims: NavigatorScreenParams<ClaimsStackParamList>;
};

// ── Nested stacks ───────────────────────────────────────────────────────────

export type FindCareStackParamList = {
  FindCareList: undefined;
  ProviderDetail: { providerId: string; providerName: string };
};

export type ClaimsStackParamList = {
  ClaimsList: undefined;
  ClaimDetail: { claimId: string };
};

// ── Typed screen props ───────────────────────────────────────────────────────

export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export type DashboardScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Dashboard'>,
  NativeStackScreenProps<AppStackParamList>
>;

export type FindCareScreenProps = NativeStackScreenProps<FindCareStackParamList, 'FindCareList'>;

export type ProviderDetailScreenProps = NativeStackScreenProps<
  FindCareStackParamList,
  'ProviderDetail'
>;

export type BenefitsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Benefits'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type PrescriptionsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Prescriptions'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type MedicalHistoryScreenProps = NativeStackScreenProps<AppStackParamList, 'History'>;

export type ClaimsListScreenProps = NativeStackScreenProps<ClaimsStackParamList, 'ClaimsList'>;

export type ClaimDetailScreenProps = NativeStackScreenProps<ClaimsStackParamList, 'ClaimDetail'>;

// ── Global type augmentation (enables useNavigation() without generics) ──────

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
