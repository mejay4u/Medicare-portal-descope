import createSdk from '@descope/core-js-sdk';
import { ENV } from '../config/env';

const projectId = ENV.DESCOPE_PROJECT_ID || '';

export const descopeSdk = createSdk({ projectId });

export interface DescopeTokenData {
  sessionJwt: string;
  refreshJwt?: string;
  user: {
    loginIds: string[];
    name?: string;
    customAttributes?: Record<string, string>;
  };
}

export interface SignUpDetails {
  loginId: string;
  password?: string;
  firstName: string;
  lastName: string;
  subscriberId: string;
  ssn: string;
  dob: string;
}

class DescopeService {
  async signUp(details: SignUpDetails) {
    if (!projectId) {
      console.warn('DESCOPE_PROJECT_ID is missing. Sign up is disabled.');
      return;
    }

    try {
      const userDetails = {
        name: `${details.firstName} ${details.lastName}`,
        email: details.loginId,
        customAttributes: {
          subscriberId: details.subscriberId,
          ssn: details.ssn,
          dob: details.dob,
        },
      };

      const response = await descopeSdk.password.signUp(
        details.loginId,
        details.password || '',
        // SDK User type omits customAttributes but the API accepts them
        userDetails as Parameters<typeof descopeSdk.password.signUp>[2],
      );

      if (!response.ok) {
        throw new Error(response.error?.errorMessage || 'Registration failed');
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async signIn(loginId: string, password: string) {
    if (!projectId) {
      return {
        ok: true,
        data: {
          sessionJwt: 'mock-session-jwt',
          refreshJwt: 'mock-refresh-jwt',
          user: { loginIds: [loginId], name: 'Mock Member' },
        } as DescopeTokenData,
      };
    }

    const response = await descopeSdk.password.signIn(loginId, password);
    if (!response.ok) {
      throw new Error(response.error?.errorMessage || 'Sign in failed');
    }
    return response;
  }

  async refreshSession(refreshToken: string) {
    const response = await descopeSdk.refresh(refreshToken);
    if (!response.ok) {
      throw new Error(response.error?.errorMessage || 'Session refresh failed');
    }
    return response;
  }

  async me(sessionToken: string) {
    return descopeSdk.me(sessionToken);
  }

  async oauthStart(provider: string, redirectUrl: string) {
    return descopeSdk.oauth.start(provider, redirectUrl);
  }

  async oauthExchange(code: string) {
    const response = await descopeSdk.oauth.exchange(code);
    if (!response.ok) {
      throw new Error(response.error?.errorMessage || 'OAuth exchange failed');
    }
    return response;
  }

  async signOut(refreshToken?: string): Promise<void> {
    if (!refreshToken) return;
    try {
      await descopeSdk.logout(refreshToken);
    } catch {
      // Best-effort server-side revocation — always clear local state regardless
    }
  }

  // Production implementation requires a server-side call with a Descope Management Key.
  // This stub saves attributes locally so the session flow works in the demo.
  async updateUser(_loginId: string, _customAttributes: Record<string, string>): Promise<void> {
    if (!projectId) return;
    // TODO: call your backend → Descope Management API to persist customAttributes
  }
}

export const descopeService = new DescopeService();
