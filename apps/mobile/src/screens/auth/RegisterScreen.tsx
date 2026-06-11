import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { descopeService, type DescopeTokenData } from '../../services/descope.service';
import { useAuthStore } from '../../store/auth.store';
import { saveRefreshToken } from '../../utils/secureStore';
import type { RegisterScreenProps } from '../../navigation/types';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri({ scheme: 'medicare-portal' });

interface OAuthUserData {
  sessionJwt: string;
  refreshJwt?: string;
  user: DescopeTokenData['user'];
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { setTokens, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'sso' | 'attributes'>('sso');
  const [oauthData, setOauthData] = useState<OAuthUserData | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    subscriberId: '',
    ssn: '',
    dob: '',
    email: '',
    password: '',
  });

  const updateForm = (key: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleGoogleSSO = async () => {
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
            setOauthData({ sessionJwt, refreshJwt, user });

            if (user.customAttributes?.subscriberId) {
              if (refreshJwt) await saveRefreshToken(refreshJwt);
              setTokens(sessionJwt, refreshJwt ?? '');
              setUser(user.loginIds[0], user.name ?? 'Member', user.customAttributes.subscriberId);
            } else {
              setStep('attributes');
            }
          }
        }
      }
    } catch (error: unknown) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'An error occurred during Google SSO.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualRegister = async () => {
    if (!form.email || !form.password || !form.subscriberId) {
      Alert.alert('Required Fields', 'Please fill in Email, Password, and Subscriber ID.');
      return;
    }

    setLoading(true);
    try {
      await descopeService.signUp({
        loginId: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        subscriberId: form.subscriberId,
        ssn: form.ssn,
        dob: form.dob,
      });

      Alert.alert(
        'Registration Successful',
        'Your account has been created. You can now sign in.',
        [{ text: 'Go to Login', onPress: () => navigation.navigate('Login') }],
      );
    } catch (error: unknown) {
      Alert.alert('Registration Failed', error instanceof Error ? error.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAttributes = async () => {
    if (!form.subscriberId || !form.ssn) {
      Alert.alert('Required Fields', 'Please provide both Subscriber ID and SSN.');
      return;
    }

    if (!oauthData) {
      Alert.alert('Error', 'Session expired. Please try signing in with Google again.');
      setStep('sso');
      return;
    }

    setLoading(true);
    try {
      await descopeService.updateUser(oauthData.user.loginIds[0], {
        subscriberId: form.subscriberId,
        ssn: form.ssn,
      });

      if (oauthData.refreshJwt) await saveRefreshToken(oauthData.refreshJwt);
      setTokens(oauthData.sessionJwt, oauthData.refreshJwt ?? '');
      setUser(oauthData.user.loginIds[0], oauthData.user.name ?? 'Member', form.subscriberId);
      Alert.alert('Registration Complete', 'Welcome to AmeriHealth Caritas!');
    } catch (error: unknown) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to save your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#003461" />
            </TouchableOpacity>
            <Text style={styles.title}>
              {step === 'sso' ? 'Create Account' : 'Verify Membership'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 'sso'
                ? 'Register to manage your benefits and access digital tools.'
                : 'Please provide your member details to link your plan.'}
            </Text>
          </View>

          {step === 'sso' ? (
            <View style={styles.form}>
              <TouchableOpacity
                style={[styles.googleBtn, loading && styles.btnDisabled]}
                onPress={handleGoogleSSO}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Continue with Google"
              >
                <MaterialCommunityIcons name="google" size={20} color="#003461" style={styles.googleIcon} />
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR REGISTER MANUALLY</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex]}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="John"
                    value={form.firstName}
                    onChangeText={v => updateForm('firstName', v)}
                  />
                </View>
                <View style={[styles.inputGroup, styles.flex]}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Doe"
                    value={form.lastName}
                    onChangeText={v => updateForm('lastName', v)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Subscriber ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456789"
                  value={form.subscriberId}
                  onChangeText={v => updateForm('subscriberId', v)}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex]}>
                  <Text style={styles.label}>SSN (Last 4)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1234"
                    value={form.ssn}
                    onChangeText={v => updateForm('ssn', v)}
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
                <View style={[styles.inputGroup, styles.flex]}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/DD/YYYY"
                    value={form.dob}
                    onChangeText={v => updateForm('dob', v)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="john.doe@example.com"
                  value={form.email}
                  onChangeText={v => updateForm('email', v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={form.password}
                  onChangeText={v => updateForm('password', v)}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.btnDisabled]}
                onPress={handleManualRegister}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Register account"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Register Account</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
                accessibilityRole="button"
                accessibilityLabel="Go to sign in"
              >
                <Text style={styles.loginLinkText}>
                  Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Subscriber ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456789"
                  value={form.subscriberId}
                  onChangeText={v => updateForm('subscriberId', v)}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>SSN (Last 4)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234"
                  value={form.ssn}
                  onChangeText={v => updateForm('ssn', v)}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.btnDisabled]}
                onPress={handleSaveAttributes}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Complete registration"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Complete Registration</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8f9fa' },
  keyboardView: { flex: 1 },
  flex: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 60 },
  header: { marginBottom: 32 },
  backBtn: { marginBottom: 16, width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#003461', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#424750', lineHeight: 22 },
  form: { gap: 16 },
  row: { flexDirection: 'row', gap: 12 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '700', color: '#003461' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1a1c1e',
  },
  submitBtn: {
    backgroundColor: '#003461',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
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
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnDisabled: { opacity: 0.6 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e1e3e4' },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: '700',
    color: '#98a2b3',
    letterSpacing: 1,
  },
  loginLink: { marginTop: 16, alignItems: 'center' },
  loginLinkText: { fontSize: 14, color: '#424750' },
  loginLinkBold: { color: '#003461', fontWeight: '700' },
});
