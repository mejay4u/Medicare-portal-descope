import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows } from '@medicare/shared';
import { usePlan } from '@medicare/shared';

const PlanSummary: React.FC = () => {
  const { data } = usePlan();

  if (!data) return null;

  const topCopays    = data.copays.slice(0, 2);
  const bottomCopays = data.copays.slice(2);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.planName}>{data.name}</Text>
          <Text style={styles.coverage}>Coverage through {data.coverageThrough}</Text>
        </View>
        <View style={styles.shieldBadge}>
          <MaterialCommunityIcons name="shield-check" size={22} color={Colors.skyBlue} />
        </View>
      </View>

      <View style={styles.copayRow}>
        {topCopays.map((c) => (
          <View key={c.type} style={styles.copayCell}>
            <Text style={styles.copayType}>{c.type}</Text>
            <Text style={styles.copayAmount}>{c.amount}</Text>
          </View>
        ))}
      </View>

      {bottomCopays.map((c) => (
        <View key={c.type} style={styles.copayFull}>
          <Text style={styles.copayType}>{c.type}</Text>
          <Text style={styles.copayAmount}>{c.amount}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.logoRow}>
          {data.logos.map((letter) => (
            <View key={letter} style={styles.logoBadge}>
              <Text style={styles.logoLetter}>{letter}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.docLink}>
          <Text style={styles.docLinkText}>View Plan Documents →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    ...Shadows.light,
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  coverage: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  shieldBadge: {
    backgroundColor: Colors.logoBadgeBg,
    borderRadius: 10,
    padding: 8,
  },
  copayRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  copayCell: {
    flex: 1,
  },
  copayFull: {
    marginBottom: 12,
  },
  copayType: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  copayAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    gap: 6,
  },
  logoBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.logoBadgeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.logoBadgeText,
  },
  docLink: {},
  docLinkText: {
    fontSize: 12,
    color: Colors.skyBlue,
    fontWeight: '600',
  },
});

export default PlanSummary;
