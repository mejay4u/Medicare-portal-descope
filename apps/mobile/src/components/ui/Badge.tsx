import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@medicare/shared';

interface BadgeProps {
  label: string;
  bg?: string;
  color?: string;
  /** Show a small filled dot to the left of the label */
  dot?: boolean;
  dotColor?: string;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  bg = Colors.primaryFixed,
  color = Colors.primary,
  dot = false,
  dotColor = Colors.green,
}) => (
  <View style={[styles.badge, { backgroundColor: bg }]}>
    {dot && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
    <Text style={[styles.label, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});

export default Badge;
