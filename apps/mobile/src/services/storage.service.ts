import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Zustand persist adapter backed by expo-secure-store (HIPAA-compliant encrypted keychain)
export const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) =>
    SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      requireAuthentication: false,
    }),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

// Non-sensitive preferences backed by AsyncStorage
export const preferenceStorage = {
  get: async <T>(key: string): Promise<T | null> => {
    const val = await AsyncStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : null;
  },
  set: <T>(key: string, value: T) =>
    AsyncStorage.setItem(key, JSON.stringify(value)),
  remove: (key: string) => AsyncStorage.removeItem(key),
};
