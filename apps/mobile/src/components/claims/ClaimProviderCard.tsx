import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@medicare/shared';
import type { ClaimData } from '@medicare/shared';

interface ClaimProviderCardProps {
  claim: ClaimData;
}

export default function ClaimProviderCard({ claim }: ClaimProviderCardProps) {
  const statusUpper = claim.status.toUpperCase();
  const isProcessed = statusUpper === 'PROCESSED' || statusUpper === 'COMPLETED' || statusUpper === 'PAID';

  const statusColors = isProcessed
    ? { bg: Colors.greenBg, dot: Colors.greenText, text: Colors.greenText }
    : { bg: '#dbeafe', dot: '#1e40af', text: '#1e40af' };

  return (
    <View style={styles.card}>
      <Text style={styles.provider}>{claim.provider}</Text>

      <View style={styles.dateRow}>
        <MaterialCommunityIcons name="calendar-blank-outline" size={14} color={Colors.onSurfaceVariant} />
        <Text style={styles.dateText}>Date of Service: {claim.date}</Text>
      </View>

      <View style={styles.metaRow}>
        <View style={[styles.typePill]}>
          <Text style={styles.typePillText}>{claim.type}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusColors.bg }]}>
          <View style={[styles.dot, { backgroundColor: statusColors.dot }]} />
          <Text style={[styles.statusText, { color: statusColors.text }]}>
            {claim.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 6,
    borderLeftColor: Colors.primary,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  provider: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: Spacing.sm,
    lineHeight: 28,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  dateText: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  typePill: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  typePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.3,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
