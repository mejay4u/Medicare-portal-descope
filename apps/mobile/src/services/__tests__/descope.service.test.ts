/**
 * Unit tests for the Descope service layer. The Descope SDK itself is mocked
 * at the module boundary; these tests verify that each auth method calls the
 * correct SDK endpoint and surfaces errors properly.
 */
jest.mock('@descope/core-js-sdk', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    password: { signIn: jest.fn(), signUp: jest.fn() },
    refresh: jest.fn(),
    me: jest.fn(),
    oauth: { start: jest.fn(), exchange: jest.fn() },
    magicLink: { signUpOrIn: { email: jest.fn() }, verify: jest.fn() },
    otp: { signUpOrIn: { whatsapp: jest.fn() }, verify: { whatsapp: jest.fn() } },
    logout: jest.fn(),
  })),
}));

type ServiceModule = typeof import('../descope.service');

function loadService(projectId?: string): ServiceModule {
  if (projectId) {
    process.env.EXPO_PUBLIC_DESCOPE_PROJECT_ID = projectId;
  } else {
    delete process.env.EXPO_PUBLIC_DESCOPE_PROJECT_ID;
  }
  let mod: ServiceModule | undefined;
  jest.isolateModules(() => {
    mod = require('../descope.service');
  });
  return mod!;
}

const ok = (data: unknown) => ({ ok: true, data });
const err = (errorMessage: string) => ({ ok: false, error: { errorMessage } });

const tokenData = {
  sessionJwt: 'sess-jwt',
  refreshJwt: 'refresh-jwt',
  user: { loginIds: ['demo@example.com'], name: 'Demo Member' },
};

describe('descopeService (configured with a real project ID)', () => {
  let service: ServiceModule['descopeService'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sdk: any;

  beforeEach(() => {
    const mod = loadService('P2DemoProject');
    service = mod.descopeService;
    sdk = mod.descopeSdk;
  });

  it('reports isConfigured = true', () => {
    expect(service.isConfigured).toBe(true);
  });

  it('signIn calls password.signIn and returns the SDK response', async () => {
    sdk.password.signIn.mockResolvedValue(ok(tokenData));
    const response = await service.signIn('demo@example.com', 'secret');
    expect(sdk.password.signIn).toHaveBeenCalledWith('demo@example.com', 'secret');
    expect(response.data).toEqual(tokenData);
  });

  it('signIn surfaces the Descope error message', async () => {
    sdk.password.signIn.mockResolvedValue(err('Invalid credentials'));
    await expect(service.signIn('demo@example.com', 'wrong')).rejects.toThrow(
      'Invalid credentials',
    );
  });

  it('oauthStart passes the provider and redirect URL through to the SDK', async () => {
    sdk.oauth.start.mockResolvedValue(ok({ url: 'https://descope/login' }));
    for (const provider of ['google', 'apple', 'facebook', 'microsoft']) {
      await service.oauthStart(provider, 'medicare-portal://auth');
      expect(sdk.oauth.start).toHaveBeenCalledWith(provider, 'medicare-portal://auth');
    }
  });

  it('oauthExchange returns tokens for a valid code', async () => {
    sdk.oauth.exchange.mockResolvedValue(ok(tokenData));
    const response = await service.oauthExchange('auth-code');
    expect(sdk.oauth.exchange).toHaveBeenCalledWith('auth-code');
    expect(response.data).toEqual(tokenData);
  });

  it('oauthExchange throws on failure', async () => {
    sdk.oauth.exchange.mockResolvedValue(err('Code expired'));
    await expect(service.oauthExchange('stale')).rejects.toThrow('Code expired');
  });

  it('magicLinkSignIn sends an email magic link with the redirect URI', async () => {
    sdk.magicLink.signUpOrIn.email.mockResolvedValue(ok({ maskedEmail: 'd***@example.com' }));
    await service.magicLinkSignIn('demo@example.com', 'medicare-portal://auth');
    expect(sdk.magicLink.signUpOrIn.email).toHaveBeenCalledWith(
      'demo@example.com',
      'medicare-portal://auth',
    );
  });

  it('magicLinkSignIn throws on failure', async () => {
    sdk.magicLink.signUpOrIn.email.mockResolvedValue(err('Email not allowed'));
    await expect(
      service.magicLinkSignIn('demo@example.com', 'medicare-portal://auth'),
    ).rejects.toThrow('Email not allowed');
  });

  it('magicLinkVerify exchanges the token for a session', async () => {
    sdk.magicLink.verify.mockResolvedValue(ok(tokenData));
    const response = await service.magicLinkVerify('t-token');
    expect(sdk.magicLink.verify).toHaveBeenCalledWith('t-token');
    expect(response.data).toEqual(tokenData);
  });

  it('magicLinkVerify throws for an invalid token', async () => {
    sdk.magicLink.verify.mockResolvedValue(err('Token invalid'));
    await expect(service.magicLinkVerify('bad')).rejects.toThrow('Token invalid');
  });

  it('whatsAppStart sends an OTP over WhatsApp', async () => {
    sdk.otp.signUpOrIn.whatsapp.mockResolvedValue(ok({ maskedPhone: '*****4567' }));
    await service.whatsAppStart('+15551234567');
    expect(sdk.otp.signUpOrIn.whatsapp).toHaveBeenCalledWith('+15551234567');
  });

  it('whatsAppVerify exchanges the OTP code for a session', async () => {
    sdk.otp.verify.whatsapp.mockResolvedValue(ok(tokenData));
    const response = await service.whatsAppVerify('+15551234567', '123456');
    expect(sdk.otp.verify.whatsapp).toHaveBeenCalledWith('+15551234567', '123456');
    expect(response.data).toEqual(tokenData);
  });

  it('whatsAppVerify throws for a wrong code', async () => {
    sdk.otp.verify.whatsapp.mockResolvedValue(err('Wrong code'));
    await expect(service.whatsAppVerify('+15551234567', '000000')).rejects.toThrow('Wrong code');
  });

  it('refreshSession exchanges a refresh token for a new session', async () => {
    sdk.refresh.mockResolvedValue(ok(tokenData));
    const response = await service.refreshSession('refresh-jwt');
    expect(sdk.refresh).toHaveBeenCalledWith('refresh-jwt');
    expect(response.data).toEqual(tokenData);
  });
});

describe('descopeService (no project ID configured)', () => {
  let service: ServiceModule['descopeService'];

  beforeEach(() => {
    service = loadService().descopeService;
  });

  it('reports isConfigured = false', () => {
    expect(service.isConfigured).toBe(false);
  });

  it.each([
    ['signIn', () => service.signIn('a@b.c', 'pw')],
    ['magicLinkSignIn', () => service.magicLinkSignIn('a@b.c', 'uri')],
    ['whatsAppStart', () => service.whatsAppStart('+15551234567')],
    ['oauthStart', () => service.oauthStart('google', 'uri')],
  ])('%s rejects with a clear configuration error', async (_name, call) => {
    await expect(call()).rejects.toThrow('EXPO_PUBLIC_DESCOPE_PROJECT_ID is not set');
  });
});
