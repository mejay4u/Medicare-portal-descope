import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSize, Radius } from '@medicare/shared';
import type { CommunicationPreference } from '@medicare/shared';

interface Props {
  icon: string;
  label: string;
  value: CommunicationPreference;
  loading?: boolean;
  onChange: (value: CommunicationPreference) => void;
}

export default function PreferenceToggleRow({ icon, label, value, loading = false, onChange }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name={icon as any} size={18} color={Colors.primary} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={[styles.toggle, loading && styles.toggleDim]}>
        <TouchableOpacity
          style={[styles.pill, value === 'paper' && styles.pillActive]}
          onPress={() => onChange('paper')}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={[styles.pillText, value === 'paper' && styles.pillTextActive]}>Paper</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pill, value === 'electronic' && styles.pillActive]}
          onPress={() => onChange('electronic')}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={[styles.pillText, value === 'electronic' && styles.pillTextActive]}>Digital</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.onSurface,
    flex: 1,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.full,
    padding: 3,
  },
  toggleDim: { opacity: 0.5 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  pillActive: { backgroundColor: Colors.primary },
  pillText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
  pillTextActive: { color: Colors.onPrimary },
});
