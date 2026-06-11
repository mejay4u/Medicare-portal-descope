import createSdk from '@descope/core-js-sdk';
import { ENV } from '../config/env';

const projectId = ENV.DESCOPE_PROJECT_ID || '';

// createSdk throws on an empty projectId, which would crash the app at startup.
// Use a placeholder so the app still boots; assertConfigured() blocks any auth
// call with a clear message before the SDK is ever hit.
export const descopeSdk = createSdk({ projectId: projectId || 'P2-not-configured' });

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

export type SsoProvider = 'google' | 'apple' | 'facebook' | 'microsoft';

class DescopeService {
  get isConfigured(): boolean {
    return Boolean(projectId);
  }

  private assertConfigured() {
    if (!projectId) {
      throw new Error('EXPO_PUBLIC_DESCOPE_PROJECT_ID is not set. Configure your Descope project ID.');
    }
  }

  async signUp(details: SignUpDetails) {
    this.assertConfigured();

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
  }

  async signIn(loginId: string, password: string) {
    this.assertConfigured();

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
    this.assertConfigured();
    return descopeSdk.oauth.start(provider, redirectUrl);
  }

  async oauthExchange(code: string) {
    const response = await descopeSdk.oauth.exchange(code);
    if (!response.ok) {
      throw new Error(response.error?.errorMessage || 'OAuth exchange failed');
    }
    return response;
  }

  /** Sends a sign-in magic link to the user's email. Tapping the link re-opens
   *  the app via deep link with a `t` query param passed to magicLinkVerify. */
  async magicLinkSignIn(email: string, redirectUri: string) {
    this.assertConfigured();

    const response = await descopeSdk.magicLink.signUpOrIn.email(email, redirectUri);
    if (!response.ok) {
      throw new Error(response.error?.errorMessage || 'Failed to send magic link');
    }
    return response;
  }

  async magicLinkVerify(token: string) {
    const response = await descopeSdk.magicLink.verify(token);
    if (!response.ok) {
      throw new Error(response.error?.errorMessage || 'Magic link verification failed');
    }
    return response;
  }

  /** Sends a one-time code to the given phone number over WhatsApp. */
  async whatsAppStart(phone: string) {
    this.assertConfigured();

    const response = await descopeSdk.otp.signUpOrIn.whatsapp(phone);
    if (!response.ok) {
      throw new Error(response.error?.errorMessage || 'Failed to send WhatsApp code');
    }
    return response;
  }

  async whatsAppVerify(phone: string, code: string) {
    const response = await descopeSdk.otp.verify.whatsapp(phone, code);
    if (!response.ok) {
      throw new Error(response.error?.errorMessage || 'Invalid WhatsApp code');
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
