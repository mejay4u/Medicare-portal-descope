import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { useClaim, useBenefits, Colors, Spacing, Radius } from '@medicare/shared';
import type { ClaimData } from '@medicare/shared';
import type { ClaimDetailScreenProps } from '../navigation/types';
import LoadingSkeleton from '../components/LoadingSkeleton';
import {
  ClaimProviderCard,
  ClaimFinancialBreakdown,
  ClaimMedicalInfo,
  ClaimStatusTracker,
  ClaimActions,
} from '../components/claims';

export default function ClaimDetailScreen({ route, navigation }: ClaimDetailScreenProps) {
  const { claimId } = route.params;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  // Use individual claim fetch (keyed per-ID so each claim has its own cache entry).
  // Seed from the already-fetched claims list so the screen renders instantly when
  // navigating from ClaimsScreen without waiting for a second network round-trip.
  const { data: claim, isLoading: claimLoading } = useClaim(claimId, {
    initialData: () => {
      const list = queryClient.getQueryData<ClaimData[]>(['claims']);
      return list?.find(c => c.id === claimId);
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(['claims'])?.dataUpdatedAt,
  });
  const { data: benefits } = useBenefits();

  const deductible = benefits?.costs.find(c => c.label === 'Annual Deductible');

  const [trackerOpen, setTrackerOpen] = useState(false);

  if (claimLoading || !claim) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.loadingPad}>
          <LoadingSkeleton style={{ height: 200 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Claim Details</Text>
          <Text style={styles.headerSubtitle}>CLAIM #{claim.id.toUpperCase()}</Text>
        </View>

        <View style={styles.headerActions}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={Colors.primary} />
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={14} color={Colors.white} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ClaimProviderCard claim={claim} />

        <ClaimFinancialBreakdown claim={claim} deductible={deductible} />

        <ClaimMedicalInfo claim={claim} />

        {/* Claim Status Tracker */}
        <View style={styles.trackerCard}>
          <TouchableOpacity
            style={styles.trackerHeader}
            onPress={() => setTrackerOpen(v => !v)}
            activeOpacity={0.7}
          >
            <View style={styles.trackerHeaderLeft}>
              <MaterialCommunityIcons name="chart-timeline-variant" size={18} color={Colors.onSurfaceVariant} />
              <Text style={styles.trackerTitle}>Claim Status Tracker</Text>
            </View>
            <MaterialCommunityIcons
              name={trackerOpen ? 'chevron-up' : 'chevron-down'}
              size={22}
              color={Colors.onSurfaceVariant}
            />
          </TouchableOpacity>

          {trackerOpen && (
            <View style={styles.trackerBody}>
              <ClaimStatusTracker journey={claim.journey} />
            </View>
          )}
        </View>

        <ClaimActions />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingPad: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  headerSubtitle: {
    fontSize: 10,
    color: Colors.secondary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  trackerCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  trackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  trackerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  trackerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  trackerBody: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
});
