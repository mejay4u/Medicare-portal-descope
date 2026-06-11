import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface Props {
  /** Override width, height, borderRadius, margin, etc. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Shared shimmer skeleton atom — use for loading states across mobile screens.
 * Replaces apps/mobile/src/components/LoadingSkeleton.tsx.
 */
export function Skeleton({ style }: Props) {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    ).start();
  }, [anim]);

  return <Animated.View style={[styles.base, style, { opacity: anim }]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#d9dadb',
    borderRadius: 16,
  },
});
