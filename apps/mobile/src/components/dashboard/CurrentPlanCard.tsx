import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, Radius, Spacing } from '@medicare/shared';
import { usePlan, useMember } from '@medicare/shared';
import { Card, Badge, PrimaryButton } from '../ui';

interface Props {
  onNavigate?: (route: string) => void;
}

const CurrentPlanCard: React.FC<Props> = ({ onNavigate }) => {
  const { data: planData, isLoading: isLoadingPlan } = usePlan();
  const { data: memberData, isLoading: isLoadingMember } = useMember();

  if (isLoadingPlan || isLoadingMember || !planData || !memberData) return null;

  const pcpCopay   = planData.copays?.[0]?.amount || '';
  const deductible = planData.copays?.[1]?.amount || '';

  return (
    <Card style={styles.card} padding={Spacing.lg}>
      <View style={styles.decorativeCircle} />

      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <View style={styles.badgeWrap}>
            <Badge label="ACTIVE PLAN" bg={Colors.secondaryFixed} color={Colors.secondary} />
          </View>
          <Text style={styles.planName}>{planData.name}</Text>
          <Text style={styles.memberId}>Member ID: {memberData.memberId}</Text>
        </View>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="shield-check" size={28} color={Colors.primary} />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>PCP COPAY</Text>
          <Text style={styles.statValue}>{pcpCopay}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>DEDUCTIBLE</Text>
          <Text style={styles.statValue}>{deductible}</Text>
        </View>
      </View>

      <PrimaryButton
        label="View All Benefits"
        icon="arrow-right"
        onPress={() => onNavigate?.('benefits')}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
    ...Shadows.card,
    shadowOpacity: 0.08,
  },
  decorativeCircle: {
    position: 'absolute',
    top: -48,
    right: -48,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(0, 101, 141, 0.05)',
    borderRadius: 64,
  },
  badgeWrap: {
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
  },
  planName: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: 4,
  },
  memberId: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  iconContainer: {
    backgroundColor: 'rgba(0, 101, 141, 0.1)',
    padding: 8,
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    padding: 16,
    borderRadius: 16,
    borderColor: 'rgba(25, 28, 29, 0.05)',
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primary,
  },
});

export default CurrentPlanCard;
