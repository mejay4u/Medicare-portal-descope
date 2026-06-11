import { Platform } from 'react-native';
import { z } from 'zod';

const envSchema = z.object({
  API_URL: z
    .string()
    .url('EXPO_PUBLIC_API_URL must be a valid URL')
    .default('http://localhost:3001'),
  SENTRY_DSN: z.string().optional(),
  POSTHOG_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().optional(),
  DESCOPE_PROJECT_ID: z.string().optional(),
  DESCOPE_PASSKEY_FLOW_ID: z.string().optional(),
  DESCOPE_ADD_PASSKEY_FLOW_ID: z.string().optional(),
});

const result = envSchema.safeParse({
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  POSTHOG_KEY: process.env.EXPO_PUBLIC_POSTHOG_KEY,
  POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  DESCOPE_PROJECT_ID: process.env.EXPO_PUBLIC_DESCOPE_PROJECT_ID,
  DESCOPE_PASSKEY_FLOW_ID: process.env.EXPO_PUBLIC_DESCOPE_PASSKEY_FLOW_ID,
  DESCOPE_ADD_PASSKEY_FLOW_ID: process.env.EXPO_PUBLIC_DESCOPE_ADD_PASSKEY_FLOW_ID,
});

if (!result.success) {
  throw new Error(`Invalid environment config:\n${result.error.message}`);
}

// Android emulators reach the host machine at 10.0.2.2 — `localhost` inside
// the emulator is the emulator itself. Physical devices still need a LAN IP
// in .env; this rewrite only applies to loopback URLs.
const API_URL =
  Platform.OS === 'android'
    ? result.data.API_URL.replace(/\/\/(localhost|127\.0\.0\.1)/, '//10.0.2.2')
    : result.data.API_URL;

export const ENV = { ...result.data, API_URL };
