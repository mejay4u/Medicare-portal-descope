import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize } from '@medicare/shared';

interface SectionTitleProps {
  title: string;
  action?: string;
  onAction?: () => void;
  style?: object;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, action, onAction, style }) => (
  <View style={[styles.row, style]}>
    <Text style={styles.title}>{title}</Text>
    {action && (
      <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
        <Text style={styles.action}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  action: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.skyBlue,
  },
});

export default SectionTitle;
