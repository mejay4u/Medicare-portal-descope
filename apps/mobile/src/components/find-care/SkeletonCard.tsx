import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors } from '@medicare/shared';

export default function SkeletonCard() {
  const opacity = React.useRef(new Animated.Value(0.4)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, styles.skeletonCard, { opacity }]}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonLines}>
        <View style={[styles.skeletonLine, { width: '60%' }]} />
        <View style={[styles.skeletonLine, { width: '40%', marginTop: 6 }]} />
        <View style={[styles.skeletonLine, { width: '30%', marginTop: 6 }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 32,
    padding: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  skeletonCard: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  skeletonAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceContainerHigh,
    flexShrink: 0,
  },
  skeletonLines: { flex: 1, paddingTop: 8 },
  skeletonLine: { height: 12, borderRadius: 6, backgroundColor: Colors.surfaceContainerHigh },
});
