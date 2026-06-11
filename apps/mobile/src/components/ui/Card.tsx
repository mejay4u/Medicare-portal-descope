import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Radius, Spacing, Shadows } from '@medicare/shared';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** 'default' = standard white card; 'elevated' = deeper shadow for feature cards */
  variant?: 'default' | 'elevated';
  padding?: number;
}

const Card: React.FC<CardProps> = ({ children, style, variant = 'default', padding }) => (
  <View
    style={[
      styles.card,
      variant === 'elevated' && styles.elevated,
      padding !== undefined && { padding },
      style,
    ]}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(25, 28, 29, 0.05)',
    ...Shadows.card,
  },
  elevated: {
    ...Shadows.elevated,
  },
});

export default Card;
