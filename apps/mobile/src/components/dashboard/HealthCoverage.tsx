import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Shadows } from '@medicare/shared';
import { usePlan } from '@medicare/shared';
import { Badge } from '../ui';

const TABS = ['H', 'D', 'V'];

const HealthCoverage: React.FC = () => {
  const { data } = usePlan();
  const [activeTab, setActiveTab] = useState('H');

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.title}>Health Coverage</Text>
        <Badge label="ACTIVE" bg={Colors.primaryFixed} color={Colors.navyDark} />
      </View>

      <View style={styles.cardsRow}>
        {data?.copays && data.copays.length >= 2 ? (
          <>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>{data.copays[0].type}</Text>
              <Text style={styles.cardValue}>{data.copays[0].amount}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>{data.copays[1].type}</Text>
              <Text style={styles.cardValue}>{data.copays[1].amount}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>CO-PAY</Text>
              <Text style={styles.cardValue}>$15.00</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>DEDUCTIBLE</Text>
              <Text style={styles.cardValue}>$0.00</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: Colors.navyDark,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.navyDark,
  },
  tabTextActive: {
    color: Colors.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.navyDark,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    ...Shadows.light,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.navyDark,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.navyDark,
  },
});

export default HealthCoverage;
