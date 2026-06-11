import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'descope_refresh_token';
const BIOMETRICS_ENABLED_KEY = 'biometrics_enabled';

export async function saveRefreshToken(token: string) {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken() {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function deleteRefreshToken() {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function setBiometricsEnabled(enabled: boolean) {
  await SecureStore.setItemAsync(BIOMETRICS_ENABLED_KEY, enabled ? 'true' : 'false');
}

export async function isBiometricsEnabled() {
  const val = await SecureStore.getItemAsync(BIOMETRICS_ENABLED_KEY);
  return val === 'true';
}

export async function clearAllData() {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(BIOMETRICS_ENABLED_KEY);
}
