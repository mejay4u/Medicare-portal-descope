import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacing, Radius, Shadows, Colors } from '@medicare/shared';
import LoadingSkeleton from '../LoadingSkeleton';

const HistorySkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.item}>
          <View style={styles.accentBar} />
          <View style={styles.header}>
            <LoadingSkeleton style={styles.icon} />
            <LoadingSkeleton style={styles.title} />
          </View>
          <LoadingSkeleton style={styles.subtitle} />
          <LoadingSkeleton style={styles.description} />
          <LoadingSkeleton style={styles.descriptionShort} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
    padding: Spacing.md,
    height: 160,
    ...Shadows.deep,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 6,
    backgroundColor: Colors.primary + '30',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
  },
  title: {
    height: 20,
    width: '60%',
    borderRadius: Radius.sm,
  },
  subtitle: {
    height: 14,
    width: '40%',
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
  },
  description: {
    height: 12,
    width: '90%',
    borderRadius: Radius.sm,
    marginBottom: 6,
  },
  descriptionShort: {
    height: 12,
    width: '50%',
    borderRadius: Radius.sm,
  },
});

export default HistorySkeleton;
