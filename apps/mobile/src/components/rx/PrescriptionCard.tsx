import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@medicare/shared';

type PrescriptionCardProps = {
  name: string;
  dosage: string;
  refillDate: string;
  refillsLeft: string;
};

export default function PrescriptionCard({ name, dosage, refillDate, refillsLeft }: PrescriptionCardProps) {
  return (
    <View style={styles.rxCard}>
      <View style={styles.rxCardTop}>
        <View>
          <Text style={styles.rxName}>{name}</Text>
          <Text style={styles.rxDosage}>{dosage}</Text>
        </View>
        <View style={styles.rxBadge}>
          <Text style={styles.rxBadgeText}>DAILY</Text>
        </View>
      </View>

      <View style={styles.rxMeta}>
        <View>
          <Text style={styles.rxMetaLabel}>NEXT REFILL DATE</Text>
          <Text style={styles.rxMetaValue}>{refillDate}</Text>
        </View>
        <View>
          <Text style={styles.rxMetaLabel}>REFILLS LEFT</Text>
          <Text style={styles.rxMetaValue}>{refillsLeft}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.refillBtn} activeOpacity={0.85}>
        <Text style={styles.refillBtnText}>Refill Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  rxCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  rxCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  rxBadge: {
    backgroundColor: `${Colors.secondary}18`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  rxBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 0.5,
  },
  rxMeta: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 18,
  },
  rxMetaLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  rxMetaValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  refillBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  refillBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
