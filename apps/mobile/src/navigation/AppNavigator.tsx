import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { TabParamList, AppStackParamList, FindCareStackParamList, ClaimsStackParamList } from './types';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import FindCareScreen from '../screens/FindCareScreen';
import ProviderDetailScreen from '../screens/find-care/ProviderDetailScreen';
import BenefitsScreen from '../screens/BenefitsScreen';
import PrescriptionsScreen from '../screens/PrescriptionsScreen';
import ClaimsScreen from '../screens/ClaimsScreen';
import ClaimDetailScreen from '../screens/ClaimDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MedicalHistoryScreen from '../screens/history/MedicalHistoryScreen';
import CaribearChatScreen from '../screens/CaribearChatScreen';
import BottomNav from '../components/BottomNav';
import AppErrorBoundary from '../components/layout/AppErrorBoundary';

function withErrorBoundary(Component: React.ComponentType<any>, screenName: string) {
  return function WrappedScreen(props: any) {
    return (
      <AppErrorBoundary screenName={screenName}>
        <Component {...props} />
      </AppErrorBoundary>
    );
  };
}

const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const FindCareStack = createNativeStackNavigator<FindCareStackParamList>();
const ClaimsStack = createNativeStackNavigator<ClaimsStackParamList>();

const FindCareScreenWrapped = withErrorBoundary(FindCareScreen, 'FindCare');
const ProviderDetailScreenWrapped = withErrorBoundary(ProviderDetailScreen, 'ProviderDetail');
const ClaimsScreenWrapped = withErrorBoundary(ClaimsScreen, 'Claims');
const ClaimDetailScreenWrapped = withErrorBoundary(ClaimDetailScreen, 'ClaimDetail');
const DashboardScreenWrapped = withErrorBoundary(DashboardScreen, 'Dashboard');
const BenefitsScreenWrapped = withErrorBoundary(BenefitsScreen, 'Benefits');
const PrescriptionsScreenWrapped = withErrorBoundary(PrescriptionsScreen, 'Prescriptions');
const MedicalHistoryScreenWrapped = withErrorBoundary(MedicalHistoryScreen, 'History');
const NotificationsScreenWrapped = withErrorBoundary(NotificationsScreen, 'Notifications');
const SettingsScreenWrapped = withErrorBoundary(SettingsScreen, 'Settings');
const CaribearChatScreenWrapped = withErrorBoundary(CaribearChatScreen, 'CaribearChat');

function FindCareNavigator() {
  return (
    <FindCareStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <FindCareStack.Screen name="FindCareList" component={FindCareScreenWrapped} />
      <FindCareStack.Screen name="ProviderDetail" component={ProviderDetailScreenWrapped} />
    </FindCareStack.Navigator>
  );
}

function ClaimsNavigator() {
  return (
    <ClaimsStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <ClaimsStack.Screen name="ClaimsList" component={ClaimsScreenWrapped} />
      <ClaimsStack.Screen name="ClaimDetail" component={ClaimDetailScreenWrapped} />
    </ClaimsStack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{ headerShown: false, lazy: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreenWrapped} />
      <Tab.Screen name="Claims" component={ClaimsNavigator} />
      <Tab.Screen name="FindCare" component={FindCareNavigator} />
      <Tab.Screen name="Benefits" component={BenefitsScreenWrapped} />
      <Tab.Screen name="Prescriptions" component={PrescriptionsScreenWrapped} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="TabHome" component={TabNavigator} />
      <AppStack.Screen
        name="Notifications"
        component={NotificationsScreenWrapped}
        options={{ animation: 'slide_from_right' }}
      />
      <AppStack.Screen
        name="Settings"
        component={SettingsScreenWrapped}
        options={{ animation: 'slide_from_right' }}
      />
      <AppStack.Screen
        name="History"
        component={MedicalHistoryScreenWrapped}
        options={{ animation: 'slide_from_right' }}
      />
      <AppStack.Screen
        name="CaribearChat"
        component={CaribearChatScreenWrapped}
        options={{ animation: 'slide_from_bottom' }}
      />
    </AppStack.Navigator>
  );
}
