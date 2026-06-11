import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@medicare/shared';

export default function NoRefillCard() {
  return (
    <View style={styles.noRefillCard}>
      <View style={styles.noRefillTop}>
        <View style={[styles.doseIconWrap, { backgroundColor: `${Colors.tertiary}15` }]}>
          <MaterialCommunityIcons name="alert-outline" size={28} color={Colors.tertiary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rxName}>Metformin</Text>
          <Text style={styles.rxDosage}>500mg ER Tablet</Text>
          <View style={styles.noRefillWarning}>
            <MaterialCommunityIcons name="alert-circle-outline" size={14} color={Colors.tertiary} />
            <Text style={styles.noRefillWarningText}>No Refills Remaining</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.requestBtn} activeOpacity={0.85}>
        <Text style={styles.requestBtnText}>Request New Prescription</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  noRefillCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    borderBottomLeftRadius: 48,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: 16,
  },
  noRefillTop: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  doseIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rxName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  rxDosage: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  noRefillWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  noRefillWarningText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.tertiary,
  },
  requestBtn: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  requestBtnText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 15,
  },
});
