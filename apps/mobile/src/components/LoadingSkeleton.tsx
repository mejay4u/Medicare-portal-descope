import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '@medicare/shared';

interface Props {
  style?: StyleProp<ViewStyle>;
}

const LoadingSkeleton: React.FC<Props> = ({ style }) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  return <Animated.View style={[styles.skeleton, style, { opacity: pulseAnim }]} />;
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.surfaceDim,
    borderRadius: 16,
  },
});

export default LoadingSkeleton;
