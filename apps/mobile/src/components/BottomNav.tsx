import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '@medicare/shared';

// Maps route name → stable kebab-case testID slug used by Detox e2e tests.
const TAB_TEST_IDS: Record<string, string> = {
  Dashboard:     'tab-dashboard',
  Claims:        'tab-claims',
  FindCare:      'tab-find-care',
  Benefits:      'tab-benefits',
  Prescriptions: 'tab-prescriptions',
};

const TAB_CONFIG: Record<
  string,
  { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; label: string }
> = {
  Dashboard:     { icon: 'view-dashboard-outline', label: 'Dashboard' },
  Claims:        { icon: 'file-document-outline', label: 'Claims' },
  FindCare:      { icon: 'map-marker-outline',      label: 'Find Care'  },
  Benefits:      { icon: 'shield-outline',          label: 'Benefits'   },
  Prescriptions: { icon: 'pill',                   label: 'Rx'         },
};

export default function BottomNav({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]} testID="bottom-tab-bar">
      {state.routes.map((route, index) => {
        const isActive = state.index === index;
        const config = TAB_CONFIG[route.name];
        if (!config) return null;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={config.label}
            testID={TAB_TEST_IDS[route.name] ?? `tab-${route.name.toLowerCase()}`}
          >
            <MaterialCommunityIcons
              name={config.icon}
              size={22}
              color={isActive ? Colors.navActive : Colors.navInactive}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {config.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.navBg,
    borderTopWidth: 1,
    borderTopColor: Colors.navBorder,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
    gap: 3,
    position: 'relative',
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.navInactive,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  labelActive: { color: Colors.navActive },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '30%',
    right: '30%',
    height: 2,
    backgroundColor: Colors.navActive,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
});
