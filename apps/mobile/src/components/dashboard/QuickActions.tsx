import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, Radius } from '@medicare/shared';
import { SectionTitle } from '../ui';

interface Props {
  onNavigate?: (route: string) => void;
}

const ACTIONS = [
  { route: 'claims',  icon: 'file-document-outline', label: 'Claims',          bg: Colors.primaryBg,   color: Colors.primary },
  { route: 'rx',      icon: 'pill',                  label: 'Prescription',    bg: Colors.secondaryBg, color: Colors.secondary },
  { route: 'history', icon: 'medical-bag',            label: 'HRA', bg: Colors.tertiaryBg,  color: Colors.tertiaryContainer },
] as const;

const QuickActions: React.FC<Props> = ({ onNavigate }) => (
  <View style={styles.wrapper}>
    <SectionTitle title="Quick Actions" />

    <View style={styles.container}>
      {ACTIONS.map(({ route, icon, label, bg, color }) => (
        <TouchableOpacity
          key={route}
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => onNavigate?.(route)}
        >
          <View style={[styles.iconBox, { backgroundColor: bg }]}>
            <MaterialCommunityIcons name={icon} size={24} color={color} />
          </View>
          <Text style={styles.cardTitle}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingVertical: 20,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(25, 28, 29, 0.05)',
    borderWidth: 1,
    ...Shadows.card,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 14,
  },
});

export default QuickActions;
