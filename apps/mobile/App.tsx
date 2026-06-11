// URL polyfill must come before any navigation import
import 'react-native-url-polyfill/auto';

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/config/queryClient';
import RootNavigator from './src/navigation/RootNavigator';
import SanctuaryLoadingScreen from './src/screens/SanctuaryLoadingScreen';
import { setBaseUrl } from '@medicare/shared';
import { PostHogProvider } from 'posthog-react-native';
import { initSentry, initPostHog } from './src/services/analytics';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';
setBaseUrl(API_URL);

initSentry();
const posthogClient = initPostHog();

// Total time the sanctuary screen is visible before fading out
const SANCTUARY_DURATION_MS = 3000;
const FADE_OUT_DURATION_MS  = 500;

function AppTree() {
  const [sanctuaryDone, setSanctuaryDone] = useState(false);
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      // Fade out the loading screen, then unmount it
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: FADE_OUT_DURATION_MS,
        useNativeDriver: true,
      }).start(() => setSanctuaryDone(true));
    }, SANCTUARY_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {/* Main app — mounted immediately but hidden beneath the loading overlay */}
          <RootNavigator />

          {/* Sanctuary overlay — fades out after SANCTUARY_DURATION_MS */}
          {!sanctuaryDone && (
            <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeOut }]}>
              <SanctuaryLoadingScreen />
            </Animated.View>
          )}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  if (posthogClient) {
    return (
      <PostHogProvider client={posthogClient}>
        <AppTree />
      </PostHogProvider>
    );
  }
  return <AppTree />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
