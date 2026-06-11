import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@medicare/shared';
import type { JourneyStep } from '@medicare/shared';

const STEP_ICONS: Record<string, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  Received: 'inbox-arrow-down-outline',
  Review: 'magnify',
  Processed: 'check-circle-outline',
  Paid: 'currency-usd',
};

const STEP_MESSAGES: Record<string, string> = {
  Received: "Your claim has been successfully received for processing.",
  Review: "Our medical experts are reviewing the service details.",
  Processed: "The claim was approved. Your Explanation of Benefits is now available.",
  Paid: "Payment has been issued to your provider.",
};

interface ClaimStatusTrackerProps {
  journey: JourneyStep[];
}

export default function ClaimStatusTracker({ journey }: ClaimStatusTrackerProps) {
  const lastCompleteIdx = journey.reduce<number>((acc, s, i) => (s.complete ? i : acc), -1);

  return (
    <View>
      {journey.map((item, index) => {
        const isActive = index === lastCompleteIdx;
        const isPast = item.complete && !isActive;
        const isFuture = !item.complete;
        const isLast = index === journey.length - 1;
        const iconName = STEP_ICONS[item.step] ?? 'circle-outline';

        return (
          <View key={item.step} style={styles.row}>
            <View style={styles.iconCol}>
              <View style={[
                styles.iconBox,
                isPast && styles.iconBoxPast,
                isActive && styles.iconBoxActive,
                isFuture && styles.iconBoxFuture,
              ]}>
                <MaterialCommunityIcons
                  name={isPast ? 'check' : iconName}
                  size={15}
                  color={isFuture ? Colors.onSurfaceVariant : Colors.white}
                />
              </View>
              {!isLast && (
                <View style={[styles.connector, isActive && styles.connectorActive]} />
              )}
            </View>

            <View style={[styles.content, !isLast && styles.contentSpaced]}>
              <Text style={[styles.stepTitle, isFuture && styles.futureTitle]}>
                {item.step}
              </Text>
              <Text style={[styles.stepDate, isFuture && styles.futureDate]}>
                {isFuture ? `ESTIMATED: ${item.date.toUpperCase()}` : item.date}
              </Text>
              {(isActive || isPast) && (
                <Text style={styles.stepDesc}>{STEP_MESSAGES[item.step] ?? ''}</Text>
              )}
              {isActive && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>CURRENT STATUS</Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  iconCol: {
    width: 28,
    alignItems: 'center',
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxPast: {
    backgroundColor: Colors.secondary,
  },
  iconBoxActive: {
    backgroundColor: Colors.primary,
  },
  iconBoxFuture: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  connector: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.outlineVariant,
    marginVertical: Spacing.xs,
  },
  connectorActive: {
    backgroundColor: Colors.secondary,
  },
  content: {
    flex: 1,
    paddingLeft: Spacing.md,
    paddingTop: 2,
  },
  contentSpaced: {
    paddingBottom: Spacing.lg,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: 2,
  },
  futureTitle: {
    color: Colors.onSurfaceVariant,
  },
  stepDate: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginBottom: 6,
  },
  futureDate: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  stepDesc: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  activeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryBg,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginTop: Spacing.xs,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
});
