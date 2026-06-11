import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { descopeService, type DescopeTokenData } from '../../services/descope.service';

interface WhatsAppLoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (data: DescopeTokenData) => void;
}

type Step = 'phone' | 'code';

export default function WhatsAppLoginModal({ visible, onClose, onSuccess }: WhatsAppLoginModalProps) {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setStep('phone');
    setPhone('');
    setCode('');
    setBusy(false);
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  // Descope requires E.164 format ("+<country><number>") and rejects anything
  // else as "Illegal phone number" — normalize and validate before calling it.
  function normalizedPhone(): string | null {
    const cleaned = phone.replace(/[\s\-().]/g, '');
    return /^\+\d{8,15}$/.test(cleaned) ? cleaned : null;
  }

  async function handleSendCode() {
    const e164 = normalizedPhone();
    if (!e164) {
      setError('Enter the full number with country code, e.g. +1 555 123 4567 or +91 98765 43210.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await descopeService.whatsAppStart(e164);
      if (!response.ok) {
        throw new Error('Failed to send WhatsApp code');
      }
      setStep('code');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send WhatsApp code.');
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyCode() {
    if (!code.trim()) {
      setError('Please enter the code you received.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await descopeService.whatsAppVerify(normalizedPhone() ?? phone.trim(), code.trim());
      if (!response.ok || !response.data) {
        throw new Error('Invalid code');
      }
      const data = response.data as unknown as DescopeTokenData;
      reset();
      onSuccess(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verification failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.backdrop}
      >
        <View style={styles.sheet} testID="whatsapp-modal">
          <View style={styles.header}>
            <MaterialCommunityIcons name="whatsapp" size={28} color="#25D366" />
            <Text style={styles.title}>Continue with WhatsApp</Text>
            <TouchableOpacity
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Close WhatsApp sign in"
              testID="whatsapp-close-button"
            >
              <MaterialCommunityIcons name="close" size={24} color="#424750" />
            </TouchableOpacity>
          </View>

          {step === 'phone' ? (
            <>
              <Text style={styles.subtitle}>
                Enter your phone number including the country code (e.g. +1, +91) and
                we&apos;ll send a one-time code to your WhatsApp.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="+1 555 123 4567"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoFocus
                testID="whatsapp-phone-input"
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
              <TouchableOpacity
                style={[styles.btn, busy && styles.btnDisabled]}
                onPress={handleSendCode}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel="Send WhatsApp code"
                testID="whatsapp-send-button"
              >
                {busy ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.btnText}>Send Code</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.subtitle}>
                We sent a code to {phone} on WhatsApp. Enter it below to sign in.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="123456"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                testID="whatsapp-code-input"
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
              <TouchableOpacity
                style={[styles.btn, busy && styles.btnDisabled]}
                onPress={handleVerifyCode}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel="Verify WhatsApp code"
                testID="whatsapp-verify-button"
              >
                {busy ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.btnText}>Verify &amp; Sign In</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStep('phone')}
                accessibilityRole="button"
                accessibilityLabel="Change phone number"
              >
                <Text style={styles.linkText}>Use a different number</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { flex: 1, fontSize: 18, fontWeight: '800', color: '#003461' },
  subtitle: { fontSize: 14, color: '#424750', lineHeight: 20 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e3e4',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1c1e',
  },
  errorText: { fontSize: 13, color: '#ba1a1a' },
  btn: {
    backgroundColor: '#003461',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  linkText: { textAlign: 'center', color: '#00658d', fontSize: 14, fontWeight: '600' },
});
