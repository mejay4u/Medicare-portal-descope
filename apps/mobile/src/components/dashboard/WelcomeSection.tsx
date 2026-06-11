import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '@medicare/shared';
import { useWelcomeSection } from '@medicare/shared';
import LoadingSkeleton from '../LoadingSkeleton';

const WelcomeSection: React.FC = () => {
  const { greeting, firstName, subtitle, isLoading } = useWelcomeSection();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingSkeleton style={{ width: '60%', height: 32, marginBottom: 8 }} />
        <LoadingSkeleton style={{ width: '80%', height: 16 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="member-name">{greeting}, {firstName}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md + 4,
    marginBottom: Spacing.md + 4,
    marginTop: 10,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.sm + 1,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
});

export default WelcomeSection;
