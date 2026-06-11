import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@medicare/shared';
import type { ClaimData, CostItem } from '@medicare/shared';

interface ClaimFinancialBreakdownProps {
  claim: ClaimData;
  deductible?: CostItem;
}

function computeFinalAmount(claim: ClaimData): number {
  const status = claim.status.toUpperCase();
  if (status === 'IN REVIEW' || status === 'PENDING REVIEW') {
    return claim.totalBilled - (claim.planDiscount ?? 0);
  }
  if (status === 'COMPLETED' || status === 'PAID') {
    return 0;
  }
  return claim.memberResponsibility;
}

export default function ClaimFinancialBreakdown({ claim, deductible }: ClaimFinancialBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const finalAmount = computeFinalAmount(claim);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(v => !v)}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="receipt" size={18} color={Colors.white} />
          <Text style={styles.headerTitle}>Financial Breakdown</Text>
        </View>
        <MaterialCommunityIcons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={Colors.white}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.body}>
          <View style={styles.row}>
            <Text style={styles.label}>Total Amount Billed</Text>
            <Text style={styles.value}>${claim.totalBilled.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.label}>Provider Discount</Text>
              <MaterialCommunityIcons name="information-outline" size={12} color="rgba(255,255,255,0.6)" />
            </View>
            <Text style={styles.value}>-${claim.planDiscount.toFixed(2)}</Text>
          </View>

          <View style={[styles.row, { marginBottom: Spacing.lg }]}>
            <Text style={styles.label}>Plan Paid</Text>
            <Text style={styles.value}>-${claim.insurancePaid.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.respLabel}>YOUR FINAL RESPONSIBILITY</Text>
          <Text style={styles.respAmount}>${finalAmount.toFixed(2)}</Text>

          {deductible && (
            <View style={styles.deductibleBox}>
              <View style={styles.deductibleHeader}>
                <Text style={styles.deductibleTitle}>DEDUCTIBLE PROGRESS</Text>
                <Text style={styles.deductibleAmount}>
                  ${deductible.spent.toLocaleString()} of ${deductible.total.toLocaleString()} met
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min((deductible.spent / deductible.total) * 100, 100)}%` },
                  ]}
                />
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  body: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: Spacing.md,
  },
  respLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
    marginBottom: 6,
  },
  respAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: Spacing.lg,
  },
  deductibleBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.md,
    padding: 12,
    gap: Spacing.sm,
  },
  deductibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deductibleTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  deductibleAmount: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.secondaryContainer,
    borderRadius: 2,
  },
});
