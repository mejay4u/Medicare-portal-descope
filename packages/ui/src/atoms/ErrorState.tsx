import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  message?: string;
  /** If provided, renders a "Try again" button */
  onRetry?: () => void;
  testID?: string;
}

/**
 * Shared error state atom — display when a data-fetching component fails.
 * Platform-neutral: no Expo or navigation APIs.
 */
export function ErrorState({ message = 'Something went wrong.', onRetry, testID }: Props) {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.btn}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry"
          testID={testID ? `${testID}-retry` : undefined}
        >
          <Text style={styles.btnText}>Try again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  icon: { fontSize: 36 },
  message: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  btn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
