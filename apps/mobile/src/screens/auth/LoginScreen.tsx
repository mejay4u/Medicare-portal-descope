import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import {
  descopeService,
  type DescopeTokenData,
  type SsoProvider,
} from '../../services/descope.service';
import { signInWithHostedFlow } from '../../services/descopeHostedAuth';
import { useAuthStore } from '../../store/auth.store';
import { getRefreshToken, isBiometricsEnabled, saveRefreshToken } from '../../utils/secureStore';
import WhatsAppLoginModal from '../../components/auth/WhatsAppLoginModal';
import SsoProviderGrid from '../../components/auth/SsoProviderGrid';
import type { LoginScreenProps } from '../../navigation/types';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri({ scheme: 'medicare-portal' });

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [loading, setLoading] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsAppVisible, setWhatsAppVisible] = useState(false);

  const { setTokens, setUser, subscriberId } = useAuthStore();
  const verifiedMagicLink = React.useRef<string | null>(null);

  React.useEffect(() => {
    LocalAuthentication.hasHardwareAsync().then(setBiometricsAvailable);
  }, []);

  // Magic link emails re-open the app with a `t` token in the URL.
  React.useEffect(() => {
    async function verifyFromUrl(url: string | null) {
      if (!url) return;
      let token: string | null = null;
      try {
        token = new URL(url).searchParams.get('t');
      } catch {
        return;
      }
      if (!token || verifiedMagicLink.current === token) return;
      verifiedMagicLink.current = token;

      setLoading(true);
      setError(null);
      try {
        const response = await descopeService.magicLinkVerify(token);
        if (response.ok && response.data) {
          await completeLogin(response.data as unknown as DescopeTokenData, 'member');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Magic link verification failed.');
      } finally {
        setLoading(false);
      }
    }

    const subscription = Linking.addEventListener('url', ({ url }) => verifyFromUrl(url));
    Linking.getInitialURL().then(verifyFromUrl);
    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function completeLogin(data: DescopeTokenData, fallbackLoginId: string) {
    const { sessionJwt, refreshJwt, user } = data;
    if (!sessionJwt) {
      throw new Error('Authentication succeeded but no session token was received.');
    }
    if (refreshJwt) await saveRefreshToken(refreshJwt);
    setTokens(sessionJwt, refreshJwt ?? '');
    setUser(
      user?.loginIds?.[0] ?? fallbackLoginId,
      user?.name ?? 'Member',
      user?.customAttributes?.subscriberId ?? subscriberId ?? undefined,
    );
  }

  async function handleSSO(provider: SsoProvider) {
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const response = await descopeService.oauthStart(provider, redirectUri);
      if (!response.ok || !response.data?.url) {
        throw new Error(response.error?.errorMessage || `Failed to start ${provider} sign-in`);
      }

      const result = await WebBrowser.openAuthSessionAsync(response.data.url, redirectUri);

      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const code = url.searchParams.get('code');

        if (code) {
          const exchangeResponse = await descopeService.oauthExchange(code);
          if (exchangeResponse.ok && exchangeResponse.data) {
            const data = exchangeResponse.data as unknown as DescopeTokenData;

            // Prefer Descope-persisted subscriber ID, fall back to locally stored one
            const existingSubId = data.user.customAttributes?.subscriberId || subscriberId;

            if (!existingSubId) {
              // First-time SSO user: account is created, but membership isn't
              // linked yet — continue on the Verify Membership step.
              navigation.navigate('Register', { oauthData: data });
              return;
            }

            await completeLogin(data, data.user.loginIds[0]);
          }
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : `${provider} sign-in failed.`);
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink() {
    if (!email) {
      setError('Enter your email address above, then tap Magic Link.');
      return;
    }
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const response = await descopeService.magicLinkSignIn(email, redirectUri);
      if (!response.ok) {
        throw new Error('Failed to send magic link');
      }
      setNotice(
        `Magic link sent to ${email}. Open the email ON THIS DEVICE and tap the link to sign in (check spam too).`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send magic link.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePasskey() {
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const data = await signInWithHostedFlow(redirectUri, email || undefined);
      await completeLogin(data, email || 'member');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Passkey sign-in failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleWhatsAppSuccess(data: DescopeTokenData) {
    setWhatsAppVisible(false);
    setError(null);
    try {
      await completeLogin(data, 'member');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'WhatsApp sign-in failed.');
    }
  }

  async function handleBiometricAuth() {
    setError(null);
    setNotice(null);
    try {
      const enabled = await isBiometricsEnabled();
      const token = await getRefreshToken();

      if (!enabled || !token) {
        Alert.alert(
          'Biometrics Not Setup',
          'Please sign in with your email and password first, then enable Biometric Login in Settings.',
          [{ text: 'OK' }],
        );
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert(
          'Not Enrolled',
          'Please set up Face ID or Touch ID in your device settings first.',
          [{ text: 'OK' }],
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Sign in to Member Portal',
        fallbackLabel: 'Use Password',
      });

      if (result.success) {
        setLoading(true);
        const response = await descopeService.refreshSession(token);
        if (response.ok && response.data) {
          const data = response.data as unknown as DescopeTokenData;
          // Persist the rotated refresh token so the next biometric login works
          if (data.refreshJwt) await saveRefreshToken(data.refreshJwt);
          setTokens(data.sessionJwt, data.refreshJwt ?? token);
          setUser(
            data.user?.loginIds?.[0] ?? 'Member',
            data.user?.name ?? 'Member',
            data.user?.customAttributes?.subscriberId,
          );
        }
      }
    } catch {
      setError('Biometric authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const response = await descopeService.signIn(email, password);

      if (response.ok && response.data) {
        await completeLogin(response.data as unknown as DescopeTokenData, email);
      } else {
        throw new Error('Invalid response from authentication service');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.root} testID="login-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <MaterialCommunityIcons name="shield-check" size={48} color="#003461" />
            <Text style={styles.brand}>AmeriHealth Caritas</Text>
          </View>

          <Text style={styles.heading}>Your health,{'\n'}your way.</Text>
          <Text style={styles.subtext}>
            Sign in to access your Medicare Advantage benefits, review claims,
            and manage your prescriptions.
          </Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="john.doe@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                testID="email-input"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                testID="password-input"
              />
            </View>

            {error && (
              <View style={styles.errorBox}>
                <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#ba1a1a" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {notice && (
              <View style={styles.noticeBox} testID="notice-box">
                <MaterialCommunityIcons name="email-check-outline" size={16} color="#1b6e3c" />
                <Text style={styles.noticeText}>{notice}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Sign in to your account"
              testID="login-button"
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.btnText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            <SsoProviderGrid disabled={loading} onPress={handleSSO} />

            <View style={styles.altMethods}>
              <TouchableOpacity
                style={[styles.altBtn, loading && styles.btnDisabled]}
                onPress={() => setWhatsAppVisible(true)}
                disabled={loading}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Continue with WhatsApp"
                testID="whatsapp-button"
              >
                <MaterialCommunityIcons name="whatsapp" size={20} color="#25D366" />
                <Text style={styles.altBtnText}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.altBtn, loading && styles.btnDisabled]}
                onPress={handleMagicLink}
                disabled={loading}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Sign in with a magic link"
                testID="magiclink-button"
              >
                <MaterialCommunityIcons name="email-fast-outline" size={20} color="#7C3AED" />
                <Text style={styles.altBtnText}>Magic Link</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.altBtn, loading && styles.btnDisabled]}
                onPress={handlePasskey}
                disabled={loading}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Sign in with a passkey"
                testID="passkey-button"
              >
                <MaterialCommunityIcons name="key-outline" size={20} color="#D97706" />
                <Text style={styles.altBtnText}>Passkey</Text>
              </TouchableOpacity>

              {biometricsAvailable && (
                <TouchableOpacity
                  style={[styles.altBtn, loading && styles.btnDisabled]}
                  onPress={handleBiometricAuth}
                  disabled={loading}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Sign in with biometrics"
                  testID="biometric-button"
                >
                  <MaterialCommunityIcons name="face-recognition" size={20} color="#003461" />
                  <Text style={styles.altBtnText}>Biometric</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate('Register')}
              accessibilityRole="button"
              accessibilityLabel="Register a new account"
            >
              <Text style={styles.registerText}>
                New user? <Text style={styles.registerTextBold}>Register here</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Trust badges */}
          <View style={styles.trustGrid}>
            {[
              { icon: 'lock-outline', label: 'HIPAA-compliant' },
              { icon: 'two-factor-authentication', label: 'Two-factor auth' },
            ].map(({ icon, label }) => (
              <View key={label} style={styles.trustItem}>
                <MaterialCommunityIcons name={icon as IconName} size={14} color="#00658d" />
                <Text style={styles.trustLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <WhatsAppLoginModal
        visible={whatsAppVisible}
        onClose={() => setWhatsAppVisible(false)}
        onSuccess={handleWhatsAppSuccess}
      />

      <Text style={styles.footer}>Need help? Call 1-800-555-1234</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8f9fa' },
  keyboardView: { flex: 1 },
  scroll: { paddingHorizontal: 28, paddingTop: 48, paddingBottom: 40 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  brand: { fontSize: 18, fontWeight: '900', color: '#003461', letterSpacing: -0.3 },
  heading: { fontSize: 34, fontWeight: '900', color: '#003461', lineHeight: 40, marginBottom: 12 },
  subtext: { fontSize: 15, color: '#424750', lineHeight: 22, marginBottom: 32 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '700', color: '#003461' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1c1e',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffdad6',
    padding: 12,
    borderRadius: 8,
  },
  errorText: { fontSize: 13, color: '#ba1a1a', flex: 1 },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#d6f5e0',
    padding: 12,
    borderRadius: 8,
  },
  noticeText: { fontSize: 13, color: '#1b6e3c', flex: 1 },
  btn: {
    backgroundColor: '#003461',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  altMethods: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  altBtn: {
    flexDirection: 'row',
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  altBtnText: { color: '#003461', fontSize: 15, fontWeight: '700' },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e1e3e4' },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 10,
    fontWeight: '800',
    color: '#98a2b3',
    letterSpacing: 1.5,
  },
  registerLink: { alignItems: 'center', marginTop: 8 },
  registerText: { fontSize: 14, color: '#424750' },
  registerTextBold: { color: '#003461', fontWeight: '700' },
  trustGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 40 },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e3e4',
  },
  trustLabel: { fontSize: 11, fontWeight: '600', color: '#424750' },
  footer: { textAlign: 'center', color: '#727781', fontSize: 13, paddingBottom: 24 },
});
