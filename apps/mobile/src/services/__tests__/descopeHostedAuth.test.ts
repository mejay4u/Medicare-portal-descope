/**
 * Tests for the hosted OIDC/PKCE flow used by passkey sign-in. expo-auth-session
 * is mocked; we verify the request wiring, token exchange, and claim mapping.
 */
const mockPromptAsync = jest.fn();
const mockExchangeCodeAsync = jest.fn();
const mockAuthRequest = jest.fn(() => ({
  promptAsync: mockPromptAsync,
  codeVerifier: 'pkce-verifier',
}));

jest.mock('expo-auth-session', () => ({
  AuthRequest: mockAuthRequest,
  exchangeCodeAsync: (...args: unknown[]) => mockExchangeCodeAsync(...args),
}));

type HostedModule = typeof import('../descopeHostedAuth');

function loadModule(projectId?: string): HostedModule {
  if (projectId) {
    process.env.EXPO_PUBLIC_DESCOPE_PROJECT_ID = projectId;
  } else {
    delete process.env.EXPO_PUBLIC_DESCOPE_PROJECT_ID;
  }
  let mod: HostedModule | undefined;
  jest.isolateModules(() => {
    mod = require('../descopeHostedAuth');
  });
  return mod!;
}

function makeIdToken(claims: Record<string, unknown>): string {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return `header.${payload}.signature`;
}

describe('signInWithHostedFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('runs the PKCE flow and maps OIDC claims to DescopeTokenData', async () => {
    const { signInWithHostedFlow } = loadModule('P2DemoProject');

    mockPromptAsync.mockResolvedValue({ type: 'success', params: { code: 'auth-code' } });
    mockExchangeCodeAsync.mockResolvedValue({
      accessToken: 'session-jwt',
      refreshToken: 'refresh-jwt',
      idToken: makeIdToken({
        sub: 'U123',
        email: 'demo@example.com',
        name: 'Demo Member',
        subscriberId: 'SUB-001',
      }),
    });

    const data = await signInWithHostedFlow('medicare-portal://auth', 'demo@example.com');

    expect(mockAuthRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: 'P2DemoProject',
        redirectUri: 'medicare-portal://auth',
        usePKCE: true,
        extraParams: { login_hint: 'demo@example.com' },
      }),
    );
    expect(mockExchangeCodeAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: 'P2DemoProject',
        code: 'auth-code',
        extraParams: { code_verifier: 'pkce-verifier' },
      }),
      expect.objectContaining({
        tokenEndpoint: 'https://api.descope.com/oauth2/v1/token',
      }),
    );
    expect(data).toEqual({
      sessionJwt: 'session-jwt',
      refreshJwt: 'refresh-jwt',
      user: {
        loginIds: ['demo@example.com'],
        name: 'Demo Member',
        customAttributes: { subscriberId: 'SUB-001' },
      },
    });
  });

  it('throws when the user cancels the browser flow', async () => {
    const { signInWithHostedFlow } = loadModule('P2DemoProject');
    mockPromptAsync.mockResolvedValue({ type: 'cancel' });

    await expect(signInWithHostedFlow('medicare-portal://auth')).rejects.toThrow(
      'Sign-in was cancelled.',
    );
    expect(mockExchangeCodeAsync).not.toHaveBeenCalled();
  });

  it('throws when no auth code is returned', async () => {
    const { signInWithHostedFlow } = loadModule('P2DemoProject');
    mockPromptAsync.mockResolvedValue({ type: 'success', params: {} });

    await expect(signInWithHostedFlow('medicare-portal://auth')).rejects.toThrow(
      'Passkey sign-in failed',
    );
  });

  it('throws a configuration error when the project ID is missing', async () => {
    const { signInWithHostedFlow } = loadModule();

    await expect(signInWithHostedFlow('medicare-portal://auth')).rejects.toThrow(
      'EXPO_PUBLIC_DESCOPE_PROJECT_ID is not set',
    );
    expect(mockPromptAsync).not.toHaveBeenCalled();
  });
});
