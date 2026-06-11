import * as AuthSession from 'expo-auth-session';
import { ENV } from '../config/env';
import type { DescopeTokenData } from './descope.service';

// Descope acts as a standard OIDC provider; the hosted sign-in page runs the
// project's default flow (enable Passkeys on it in the Descope console) and
// WebAuthn works there because the page runs in a real browser session.
const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://api.descope.com/oauth2/v1/authorize',
  tokenEndpoint: 'https://api.descope.com/oauth2/v1/token',
};

// Which Descope flow the hosted page runs. Must exist (deployed) in the
// project; override with EXPO_PUBLIC_DESCOPE_PASSKEY_FLOW_ID.
const PASSKEY_FLOW_ID =
  ENV.DESCOPE_PASSKEY_FLOW_ID || 'sign-in-passkeys-or-social-with-otp-mfa';

function decodeJwtPayload(jwt: string): Record<string, unknown> {
  try {
    const payload = jwt.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(globalThis.atob(normalized)) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Runs the Descope hosted sign-in flow (OIDC + PKCE) in the system browser
 *  and returns Descope session tokens. Used for passkey sign-in, where the
 *  WebAuthn ceremony must happen in a browser context. */
export async function signInWithHostedFlow(
  redirectUri: string,
  loginHint?: string,
): Promise<DescopeTokenData> {
  const projectId = ENV.DESCOPE_PROJECT_ID;
  if (!projectId) {
    throw new Error('EXPO_PUBLIC_DESCOPE_PROJECT_ID is not set. Configure your Descope project ID.');
  }

  const request = new AuthSession.AuthRequest({
    clientId: projectId,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
    usePKCE: true,
    extraParams: {
      flow: PASSKEY_FLOW_ID,
      ...(loginHint ? { login_hint: loginHint } : {}),
    },
  });

  const result = await request.promptAsync(discovery);
  if (result.type === 'cancel' || result.type === 'dismiss') {
    throw new Error('Sign-in was cancelled.');
  }
  if (result.type !== 'success' || !result.params.code) {
    throw new Error('Passkey sign-in failed. Please try again.');
  }

  const tokens = await AuthSession.exchangeCodeAsync(
    {
      clientId: projectId,
      code: result.params.code,
      redirectUri,
      extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : {},
    },
    discovery,
  );

  const claims = decodeJwtPayload(tokens.idToken ?? '');
  const email = typeof claims.email === 'string' ? claims.email : undefined;
  const sub = typeof claims.sub === 'string' ? claims.sub : 'member';
  const name = typeof claims.name === 'string' ? claims.name : undefined;
  const subscriberId = typeof claims.subscriberId === 'string' ? claims.subscriberId : undefined;

  return {
    sessionJwt: tokens.accessToken,
    refreshJwt: tokens.refreshToken,
    user: {
      loginIds: [email ?? sub],
      name,
      customAttributes: subscriberId ? { subscriberId } : undefined,
    },
  };
}
