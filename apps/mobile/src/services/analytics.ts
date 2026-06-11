import * as Sentry from '@sentry/react-native';
import { PostHog } from 'posthog-react-native';
import { maskObject, maskString } from './hipaa';
import { ENV } from '../config/env';

// ── Sentry ────────────────────────────────────────────────────────────────────

export function initSentry() {
  if (!ENV.SENTRY_DSN) return;

  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    environment: __DEV__ ? 'development' : 'production',
    tracesSampleRate: __DEV__ ? 0 : 0.1,
    beforeSend(event) {
      // Strip PHI from every field before the event leaves the device
      if (event.message) event.message = maskString(event.message);
      if (event.exception?.values) {
        event.exception.values = event.exception.values.map((ex) => ({
          ...ex,
          value: ex.value ? maskString(ex.value) : ex.value,
        }));
      }
      if (event.breadcrumbs) {
        event.breadcrumbs = (event.breadcrumbs as any[]).map((b: any) => ({
          ...b,
          message: b.message ? maskString(b.message) : b.message,
          data: b.data ? (maskObject(b.data) as Record<string, unknown>) : b.data,
        }));
      }
      if (event.extra) {
        event.extra = maskObject(event.extra) as Record<string, unknown>;
      }
      if (event.tags) {
        event.tags = maskObject(event.tags) as Record<string, string>;
      }
      return event;
    },
  });
}

// ── PostHog ───────────────────────────────────────────────────────────────────

let _posthog: PostHog | null = null;

export function initPostHog(): PostHog | null {
  if (!ENV.POSTHOG_KEY) return null;

  _posthog = new PostHog(ENV.POSTHOG_KEY, {
    host: ENV.POSTHOG_HOST ?? 'https://app.posthog.com',
  });

  return _posthog;
}

// ── Analytics facade ──────────────────────────────────────────────────────────
// Thin wrapper so we can swap providers without touching call sites.
// All properties are run through maskObject before dispatch.

export const Analytics = {
  /** Track a named event with optional properties. Never include PHI in props. */
  track(event: string, properties?: Record<string, unknown>) {
    const safe = properties ? maskObject(properties) : undefined;
    _posthog?.capture(event, safe as any);
  },

  /** Record a non-fatal error (goes to Sentry, not PostHog). */
  captureException(error: unknown, context?: Record<string, unknown>) {
    Sentry.withScope((scope) => {
      if (context) scope.setExtras(maskObject(context) as Record<string, unknown>);
      Sentry.captureException(error);
    });
  },

  /** Set the current user for session attribution. Use only non-PHI identifiers. */
  identify(userId: string) {
    Sentry.setUser({ id: userId });
    _posthog?.identify(userId);
  },

  /** Clear user identity on logout. */
  reset() {
    Sentry.setUser(null);
    _posthog?.reset();
  },
};
