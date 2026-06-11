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
});

const result = envSchema.safeParse({
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  POSTHOG_KEY: process.env.EXPO_PUBLIC_POSTHOG_KEY,
  POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  DESCOPE_PROJECT_ID: process.env.EXPO_PUBLIC_DESCOPE_PROJECT_ID,
});

if (!result.success) {
  throw new Error(`Invalid environment config:\n${result.error.message}`);
}

export const ENV = result.data;
