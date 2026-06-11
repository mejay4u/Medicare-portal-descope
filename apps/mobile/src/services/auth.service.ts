import * as AuthSession from 'expo-auth-session';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuthStore } from '../store/auth.store';
import { ENV } from '../config/env';
import { AuthError } from '../types/errors';

const DESCOPE_PROJECT_ID = ENV.DESCOPE_PROJECT_ID ?? '';
const DISCOVERY_URL = `https://api.descope.com/oauth2/v1`;

const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: `https://api.descope.com/oauth2/v1/authorize`,
  tokenEndpoint: `https://api.descope.com/oauth2/v1/token`,
  revocationEndpoint: `https://api.descope.com/oauth2/v1/revoke`,
};

class AuthService {
  private redirectUri = AuthSession.makeRedirectUri({ 
    scheme: 'medicare-portal',
    path: 'auth'
  });

  async initiateLogin(): Promise<void> {
    if (!DESCOPE_PROJECT_ID) {
      // Dev bypass when Descope project ID is not configured
      useAuthStore.getState().setTokens('dev-access-token', 'dev-refresh-token');
      useAuthStore.getState().setUser('dev-user-id', 'Member');
      return;
    }

    const request = new AuthSession.AuthRequest({
      clientId: DESCOPE_PROJECT_ID,
      redirectUri: this.redirectUri,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      usePKCE: true,
      extraParams: {
        flow: 'LoginFlow',
      },
    });

    const result = await request.promptAsync(discovery);

    if (result.type === 'success' && result.params.code) {
      await this.exchangeCodeForTokens(
        result.params.code,
        request.codeVerifier ?? '',
      );
    } else if (result.type === 'error') {
      throw new AuthError(result.error?.message ?? 'Login failed');
    }
  }

  private async exchangeCodeForTokens(code: string, verifier: string): Promise<void> {
    const response = await AuthSession.exchangeCodeAsync(
      {
        clientId: DESCOPE_PROJECT_ID,
        code,
        redirectUri: this.redirectUri,
        extraParams: { code_verifier: verifier },
      },
      discovery,
    );

    const store = useAuthStore.getState();
    store.setTokens(response.accessToken, response.refreshToken ?? '');

    if (response.idToken) {
      const [, payloadB64] = response.idToken.split('.');
      const payload = JSON.parse(atob(payloadB64));
      store.setUser(payload.sub ?? '', payload.name ?? 'Member');
    }
  }

  async refreshAccessToken(): Promise<string> {
    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) throw new AuthError('No refresh token available');

    if (!DESCOPE_PROJECT_ID) {
      return 'dev-access-token';
    }

    const response = await AuthSession.refreshAsync(
      { clientId: DESCOPE_PROJECT_ID, refreshToken },
      discovery,
    );

    useAuthStore.getState().setTokens(response.accessToken, response.refreshToken ?? refreshToken);
    return response.accessToken;
  }

  async logout(): Promise<void> {
    const store = useAuthStore.getState();
    if (store.accessToken && DESCOPE_PROJECT_ID) {
      try {
        await AuthSession.revokeAsync(
          { clientId: DESCOPE_PROJECT_ID, token: store.accessToken },
          discovery,
        );
      } catch {
        // Best-effort revocation — always clear local state
      }
    }
    store.logout();
  }

  async authenticateWithBiometrics(reason: string): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) return true; // Fallback: allow access

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });

    return result.success;
  }

  get isDevMode(): boolean {
    return !DESCOPE_PROJECT_ID;
  }
}

export const authService = new AuthService();

// Convenience hook for login screen
export { DISCOVERY_URL };
