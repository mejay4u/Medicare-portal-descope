import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, usePrescriptions } from '@medicare/shared';

import TopBar from '../components/TopBar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import PharmacyCard from '../components/rx/PharmacyCard';
import DailySchedule from '../components/rx/DailySchedule';
import PrescriptionCard from '../components/rx/PrescriptionCard';
import NoRefillCard from '../components/rx/NoRefillCard';
import PharmacistCard from '../components/rx/PharmacistCard';


const RxScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { data: prescriptionsData, isLoading } = usePrescriptions();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <TopBar />
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Rx Management</Text>
          <Text style={styles.pageSubtitle}>Your sanctuary for medication clarity.</Text>
        </View>
        <TouchableOpacity style={styles.historyBtn} activeOpacity={0.8}>
          <MaterialCommunityIcons name="history" size={18} color={Colors.onSecondaryContainer} />
          <Text style={styles.historyBtnText}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PharmacyCard />
        <DailySchedule />

        {/* Active Prescriptions */}
        <View style={styles.prescriptionsHeader}>
          <Text style={styles.prescriptionsTitle}>Active Prescriptions</Text>
          <Text style={styles.prescriptionsCount}>
            {isLoading ? '...' : `${prescriptionsData?.active?.length || 0} active`}
          </Text>
        </View>

        {isLoading ? (
          <>
            <LoadingSkeleton style={{ marginHorizontal: 16, marginBottom: 12, height: 120, borderRadius: 20 }} />
            <LoadingSkeleton style={{ marginHorizontal: 16, marginBottom: 12, height: 120, borderRadius: 20 }} />
          </>
        ) : (
          prescriptionsData?.active?.map((rx: any, idx: number) => (
            <PrescriptionCard
              key={idx}
              name={rx.name}
              dosage={rx.dose}
              refillDate={rx.lastFilled}
              refillsLeft={rx.refills.toString().padStart(2, '0')}
            />
          ))
        )}

        {(!isLoading && prescriptionsData?.active?.length === 0) && <NoRefillCard />}
        
        <PharmacistCard />

        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceContainerLow },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 4, paddingBottom: 8 },

  // ── Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${Colors.secondaryContainer}30`,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  historyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSecondaryContainer,
  },
  
  // ── Prescriptions header
  prescriptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginHorizontal: 16,
    marginBottom: 14,
  },
  prescriptionsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  prescriptionsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
});

export default RxScreen;
