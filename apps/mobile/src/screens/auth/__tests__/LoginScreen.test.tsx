import React from 'react';
import { Alert, Linking } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

const mockSetTokens = jest.fn();
const mockSetUser = jest.fn();

const tokenData = {
  sessionJwt: 'sess-jwt',
  refreshJwt: 'refresh-jwt',
  user: {
    loginIds: ['demo@example.com'],
    name: 'Demo Member',
    customAttributes: { subscriberId: 'SUB-001' },
  },
};

jest.mock('../../../services/descope.service', () => ({
  descopeService: {
    isConfigured: true,
    signIn: jest.fn(),
    oauthStart: jest.fn(),
    oauthExchange: jest.fn(),
    magicLinkSignIn: jest.fn(),
    magicLinkVerify: jest.fn(),
    whatsAppStart: jest.fn(),
    whatsAppVerify: jest.fn(),
    refreshSession: jest.fn(),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockDescopeService = require('../../../services/descope.service').descopeService;

const mockSignInWithHostedFlow = jest.fn();
jest.mock('../../../services/descopeHostedAuth', () => ({
  signInWithHostedFlow: (...args: unknown[]) => mockSignInWithHostedFlow(...args),
}));

jest.mock('../../../store/auth.store', () => ({
  useAuthStore: () => ({
    setTokens: mockSetTokens,
    setUser: mockSetUser,
    subscriberId: null,
  }),
}));

jest.mock('../../../utils/secureStore', () => ({
  saveRefreshToken: jest.fn().mockResolvedValue(undefined),
  getRefreshToken: jest.fn().mockResolvedValue('stored-refresh'),
  isBiometricsEnabled: jest.fn().mockResolvedValue(true),
}));

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn().mockResolvedValue(true),
  isEnrolledAsync: jest.fn().mockResolvedValue(true),
  authenticateAsync: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
  openAuthSessionAsync: jest.fn(),
}));

jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'medicare-portal://auth'),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WebBrowser = require('expo-web-browser');

describe('LoginScreen', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation: any = { navigate: jest.fn() };
  let urlListener: ((event: { url: string }) => void) | undefined;

  function renderScreen() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return render(<LoginScreen navigation={navigation} route={{} as any} />);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    urlListener = undefined;
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    jest.spyOn(Linking, 'getInitialURL').mockResolvedValue(null);
    jest.spyOn(Linking, 'addEventListener').mockImplementation((_event, callback) => {
      urlListener = callback as (event: { url: string }) => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { remove: jest.fn() } as any;
    });
  });

  it('renders every sign-in method', async () => {
    const { getByTestId } = renderScreen();

    for (const id of [
      'sso-google-button',
      'sso-apple-button',
      'sso-facebook-button',
      'sso-microsoft-button',
      'whatsapp-button',
      'magiclink-button',
      'passkey-button',
      'email-input',
      'password-input',
      'login-button',
    ]) {
      expect(getByTestId(id)).toBeTruthy();
    }

    // Biometric button appears once hardware support resolves
    await waitFor(() => expect(getByTestId('biometric-button')).toBeTruthy());
  });

  it('signs in with email and password', async () => {
    mockDescopeService.signIn.mockResolvedValue({ ok: true, data: tokenData });
    const { getByTestId } = renderScreen();

    fireEvent.changeText(getByTestId('email-input'), 'demo@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'secret');
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(mockDescopeService.signIn).toHaveBeenCalledWith('demo@example.com', 'secret');
      expect(mockSetTokens).toHaveBeenCalledWith('sess-jwt', 'refresh-jwt');
      expect(mockSetUser).toHaveBeenCalledWith('demo@example.com', 'Demo Member', 'SUB-001');
    });
  });

  it.each(['google', 'apple', 'facebook', 'microsoft'] as const)(
    'completes the %s SSO flow',
    async (provider) => {
      mockDescopeService.oauthStart.mockResolvedValue({
        ok: true,
        data: { url: 'https://descope/login' },
      });
      WebBrowser.openAuthSessionAsync.mockResolvedValue({
        type: 'success',
        url: 'medicare-portal://auth?code=auth-code',
      });
      mockDescopeService.oauthExchange.mockResolvedValue({ ok: true, data: tokenData });

      const { getByTestId } = renderScreen();
      fireEvent.press(getByTestId(`sso-${provider}-button`));

      await waitFor(() => {
        expect(mockDescopeService.oauthStart).toHaveBeenCalledWith(
          provider,
          'medicare-portal://auth',
        );
        expect(mockDescopeService.oauthExchange).toHaveBeenCalledWith('auth-code');
        expect(mockSetTokens).toHaveBeenCalledWith('sess-jwt', 'refresh-jwt');
      });
    },
  );

  it('blocks SSO sign-in and points to registration when no subscriber ID is linked', async () => {
    mockDescopeService.oauthStart.mockResolvedValue({
      ok: true,
      data: { url: 'https://descope/login' },
    });
    WebBrowser.openAuthSessionAsync.mockResolvedValue({
      type: 'success',
      url: 'medicare-portal://auth?code=auth-code',
    });
    mockDescopeService.oauthExchange.mockResolvedValue({
      ok: true,
      data: { ...tokenData, user: { loginIds: ['demo@example.com'], name: 'Demo Member' } },
    });

    const { getByTestId } = renderScreen();
    fireEvent.press(getByTestId('sso-google-button'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Account Incomplete',
        expect.any(String),
        expect.any(Array),
      );
    });
    expect(mockSetTokens).not.toHaveBeenCalled();
  });

  it('requires an email before sending a magic link', async () => {
    const { getByTestId, findByText } = renderScreen();
    fireEvent.press(getByTestId('magiclink-button'));

    expect(await findByText(/Enter your email address above/)).toBeTruthy();
    expect(mockDescopeService.magicLinkSignIn).not.toHaveBeenCalled();
  });

  it('sends a magic link and shows confirmation', async () => {
    mockDescopeService.magicLinkSignIn.mockResolvedValue({ ok: true, data: {} });
    const { getByTestId } = renderScreen();

    fireEvent.changeText(getByTestId('email-input'), 'demo@example.com');
    fireEvent.press(getByTestId('magiclink-button'));

    await waitFor(() => {
      expect(mockDescopeService.magicLinkSignIn).toHaveBeenCalledWith(
        'demo@example.com',
        'medicare-portal://auth',
      );
      expect(getByTestId('notice-box')).toBeTruthy();
    });
  });

  it('verifies a magic link arriving via deep link and signs the user in', async () => {
    mockDescopeService.magicLinkVerify.mockResolvedValue({ ok: true, data: tokenData });
    renderScreen();

    await waitFor(() => expect(urlListener).toBeDefined());
    urlListener!({ url: 'medicare-portal://login?t=magic-token' });

    await waitFor(() => {
      expect(mockDescopeService.magicLinkVerify).toHaveBeenCalledWith('magic-token');
      expect(mockSetTokens).toHaveBeenCalledWith('sess-jwt', 'refresh-jwt');
    });
  });

  it('signs in with a passkey via the hosted flow', async () => {
    mockSignInWithHostedFlow.mockResolvedValue(tokenData);
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('passkey-button'));

    await waitFor(() => {
      expect(mockSignInWithHostedFlow).toHaveBeenCalledWith('medicare-portal://auth', undefined);
      expect(mockSetTokens).toHaveBeenCalledWith('sess-jwt', 'refresh-jwt');
    });
  });

  it('completes the WhatsApp OTP flow end to end', async () => {
    mockDescopeService.whatsAppStart.mockResolvedValue({ ok: true, data: {} });
    mockDescopeService.whatsAppVerify.mockResolvedValue({ ok: true, data: tokenData });
    const { getByTestId, findByTestId } = renderScreen();

    fireEvent.press(getByTestId('whatsapp-button'));
    fireEvent.changeText(await findByTestId('whatsapp-phone-input'), '+15551234567');
    fireEvent.press(getByTestId('whatsapp-send-button'));

    fireEvent.changeText(await findByTestId('whatsapp-code-input'), '123456');
    fireEvent.press(getByTestId('whatsapp-verify-button'));

    await waitFor(() => {
      expect(mockDescopeService.whatsAppStart).toHaveBeenCalledWith('+15551234567');
      expect(mockDescopeService.whatsAppVerify).toHaveBeenCalledWith('+15551234567', '123456');
      expect(mockSetTokens).toHaveBeenCalledWith('sess-jwt', 'refresh-jwt');
    });
  });

  it('signs in with biometrics using the stored refresh token', async () => {
    mockDescopeService.refreshSession.mockResolvedValue({ ok: true, data: tokenData });
    const { getByTestId } = renderScreen();

    const biometricButton = await waitFor(() => getByTestId('biometric-button'));
    fireEvent.press(biometricButton);

    await waitFor(() => {
      expect(mockDescopeService.refreshSession).toHaveBeenCalledWith('stored-refresh');
      expect(mockSetTokens).toHaveBeenCalledWith('sess-jwt', 'refresh-jwt');
    });
  });

  it('shows the Descope error message when password sign-in fails', async () => {
    mockDescopeService.signIn.mockRejectedValue(new Error('Invalid credentials'));
    const { getByTestId, findByText } = renderScreen();

    fireEvent.changeText(getByTestId('email-input'), 'demo@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'wrong');
    fireEvent.press(getByTestId('login-button'));

    expect(await findByText('Invalid credentials')).toBeTruthy();
    expect(mockSetTokens).not.toHaveBeenCalled();
  });
});
