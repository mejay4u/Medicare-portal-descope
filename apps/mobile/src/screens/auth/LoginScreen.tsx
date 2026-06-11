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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { descopeService, type DescopeTokenData } from '../../services/descope.service';
import { useAuthStore } from '../../store/auth.store';
import { getRefreshToken, isBiometricsEnabled, saveRefreshToken } from '../../utils/secureStore';
import type { LoginScreenProps } from '../../navigation/types';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri({ scheme: 'medicare-portal' });

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [loading, setLoading] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setTokens, setUser, subscriberId } = useAuthStore();

  React.useEffect(() => {
    LocalAuthentication.hasHardwareAsync().then(setBiometricsAvailable);
  }, []);

  async function handleGoogleSSO() {
    setError(null);
    setLoading(true);
    try {
      const response = await descopeService.oauthStart('google', redirectUri);
      if (!response.ok || !response.data?.url) {
        throw new Error(response.error?.errorMessage || 'Failed to start Google SSO');
      }

      const result = await WebBrowser.openAuthSessionAsync(response.data.url, redirectUri);

      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const code = url.searchParams.get('code');

        if (code) {
          const exchangeResponse = await descopeService.oauthExchange(code);
          if (exchangeResponse.ok && exchangeResponse.data) {
            const { sessionJwt, refreshJwt, user } = exchangeResponse.data as unknown as DescopeTokenData;

            // Prefer Descope-persisted subscriber ID, fall back to locally stored one
            const existingSubId = user.customAttributes?.subscriberId || subscriberId;

            if (!existingSubId) {
              Alert.alert(
                'Account Incomplete',
                'Please complete your registration first to link your membership.',
                [{ text: 'Go to Register', onPress: () => navigation.navigate('Register') }],
              );
              return;
            }

            if (refreshJwt) await saveRefreshToken(refreshJwt);
            setTokens(sessionJwt, refreshJwt ?? '');
            setUser(user.loginIds[0], user.name ?? 'Member', existingSubId);
          }
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleBiometricAuth() {
    setError(null);
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
          const { sessionJwt, refreshJwt, user } = response.data as unknown as DescopeTokenData;
          setTokens(sessionJwt, refreshJwt ?? token);
          setUser(
            user?.loginIds?.[0] ?? 'Member',
            user?.name ?? 'Member',
            user?.customAttributes?.subscriberId,
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
    try {
      const response = await descopeService.signIn(email, password);

      if (response.ok && response.data) {
        const { sessionJwt, refreshJwt, user } = response.data as unknown as DescopeTokenData;

        if (!sessionJwt) {
          throw new Error('Authentication succeeded but no session token was received.');
        }

        if (refreshJwt) await saveRefreshToken(refreshJwt);
        setTokens(sessionJwt, refreshJwt ?? '');
        setUser(
          user?.loginIds?.[0] ?? email,
          user?.name ?? 'Member',
          user?.customAttributes?.subscriberId,
        );
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
            <TouchableOpacity
              style={[styles.googleBtn, loading && styles.btnDisabled]}
              onPress={handleGoogleSSO}
              disabled={loading}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
            >
              <MaterialCommunityIcons name="google" size={20} color="#003461" style={styles.googleIcon} />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR SIGN IN WITH EMAIL</Text>
              <View style={styles.dividerLine} />
            </View>

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

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.btn, styles.btnFlex, loading && styles.btnDisabled]}
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

              {biometricsAvailable && (
                <TouchableOpacity
                  style={styles.biometricBtn}
                  onPress={handleBiometricAuth}
                  disabled={loading}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Sign in with biometrics"
                >
                  <MaterialCommunityIcons name="face-recognition" size={28} color="#003461" />
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
                <MaterialCommunityIcons name={icon as any} size={14} color="#00658d" />
                <Text style={styles.trustLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  btn: {
    backgroundColor: '#003461',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnFlex: { flex: 1 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  googleBtn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: { marginRight: 10 },
  googleBtnText: { color: '#003461', fontSize: 16, fontWeight: '700' },
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
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  biometricBtn: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#003461',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
