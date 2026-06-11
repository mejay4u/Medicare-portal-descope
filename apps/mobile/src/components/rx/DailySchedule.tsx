import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@medicare/shared';

export default function DailySchedule() {
  return (
    <View style={styles.scheduleSection}>
      <View style={styles.scheduleHeader}>
        <MaterialCommunityIcons name="calendar-text-outline" size={22} color={Colors.primary} />
        <Text style={styles.scheduleSectionTitle}>Daily Schedule</Text>
      </View>

      {/* Morning */}
      <View style={[styles.doseCard, { borderLeftColor: Colors.secondary }]}>
        <View style={[styles.doseIconWrap, { backgroundColor: `${Colors.secondary}20` }]}>
          <MaterialCommunityIcons name="weather-sunny" size={28} color={Colors.secondary} />
        </View>
        <View style={styles.doseInfo}>
          <Text style={styles.doseName}>Morning</Text>
          <Text style={styles.doseSub}>Take with breakfast</Text>
        </View>
        <Text style={styles.dosePill}>1 Pill</Text>
      </View>

      {/* Evening */}
      <View style={[styles.doseCard, { borderLeftColor: Colors.primary }]}>
        <View style={[styles.doseIconWrap, { backgroundColor: `${Colors.primary}20` }]}>
          <MaterialCommunityIcons name="weather-night" size={28} color={Colors.primary} />
        </View>
        <View style={styles.doseInfo}>
          <Text style={styles.doseName}>Evening</Text>
          <Text style={styles.doseSub}>Take before bedtime</Text>
        </View>
        <Text style={styles.dosePill}>2 Pills</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scheduleSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  scheduleSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  doseCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 14,
    borderLeftWidth: 6,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  doseIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  doseInfo: { flex: 1 },
  doseName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primary,
  },
  doseSub: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  dosePill: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
});
