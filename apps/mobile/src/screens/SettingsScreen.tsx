import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  StatusBar,
  ActivityIndicator,
  BackHandler,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { descopeService } from '../services/descope.service';
import {
  Colors,
  FontSize,
  Radius,
  useSettings,
  useUpdateSettingsMember,
  useUpdateSettingsPreferences,
} from '@medicare/shared';
import type { CommunicationPreference, SettingsPreferences } from '@medicare/shared';
import EditFieldModal from '../components/settings/EditFieldModal';
import PreferenceToggleRow from '../components/settings/PreferenceToggleRow';
import { isBiometricsEnabled, setBiometricsEnabled, clearAllData } from '../utils/secureStore';
import { useAuthStore } from '../store/auth.store';

type EditingField = 'address' | 'phone' | null;

// ─── Small helpers ────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <View style={styles.sectionLabelRow}>
      <Text style={styles.sectionLabelText}>{label}</Text>
      <View style={styles.sectionLabelLine} />
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function ActionRow({
  icon,
  label,
  value,
  onPress,
  destructive = false,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.actionRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconBox, destructive && styles.iconBoxDestructive]}>
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          color={destructive ? Colors.error : Colors.primary}
        />
      </View>
      <Text style={[styles.actionLabel, destructive && styles.actionLabelDestructive]}>
        {label}
      </Text>
      {value ? (
        <Text style={styles.actionValue}>{value}</Text>
      ) : (
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={Colors.outlineVariant}
        />
      )}
    </TouchableOpacity>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { data, isLoading, isError, refetch } = useSettings();
  const updateMember = useUpdateSettingsMember();
  const updatePrefs = useUpdateSettingsPreferences();

  const [localPrefs, setLocalPrefs] = useState<SettingsPreferences | null>(null);
  const prefs = localPrefs ?? data?.preferences ?? null;

  const [editingField, setEditingField] = useState<EditingField>(null);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabledState] = useState(false);

  useEffect(() => {
    isBiometricsEnabled().then(setBiometricsEnabledState);
  }, []);

  async function handleToggleBiometrics(val: boolean) {
    setBiometricsEnabledState(val);
    await setBiometricsEnabled(val);
  }

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.canGoBack()) { navigation.goBack(); return true; }
      return false;
    });
    return () => sub.remove();
  }, [navigation]);

  function handleBack() {
    if (navigation.canGoBack()) navigation.goBack();
  }

  async function handleSaveField(value: string) {
    if (!editingField || !data) return;
    try {
      await updateMember.mutateAsync({ [editingField]: value });
      setEditingField(null);
    } catch {
      Alert.alert('Error', 'Could not save changes. Please try again.');
    }
  }

  async function handleTogglePref(
    key: 'communicationPreference' | 'eobPreference',
    val: CommunicationPreference,
  ) {
    if (!data) return;
    const updated = { ...data.preferences, ...localPrefs, [key]: val } as SettingsPreferences;
    setLocalPrefs(updated);
    try {
      await updatePrefs.mutateAsync({ [key]: val });
      setLocalPrefs(null);
    } catch {
      setLocalPrefs(null);
      Alert.alert('Error', 'Could not update preference. Please try again.');
    }
  }

  const { logout, refreshToken } = useAuthStore();

  async function handleSignOut() {
    await descopeService.signOut(refreshToken ?? undefined);
    await clearAllData();
    logout();
  }

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will clear all local tokens, biometrics, and member links. You will be logged out immediately.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await handleSignOut();
            } catch {
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ],
    );
  };

  const initials = data?.member.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '';

  const editingValue =
    editingField === 'address' ? data?.member.address ?? ''
      : editingField === 'phone' ? data?.member.phone ?? ''
        : '';

  const editingLabel =
    editingField === 'address' ? 'Address'
      : editingField === 'phone' ? 'Phone Number'
        : '';

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surfaceContainerLowest} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={handleBack} activeOpacity={0.8}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        {initials ? (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        ) : (
          <View style={[styles.avatarCircle, styles.avatarCirclePlaceholder]} />
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Loading ─────────────────────────────────────────────────────── */}
        {isLoading && (
          <View style={styles.centeredWrap}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}

        {/* ── Error ───────────────────────────────────────────────────────── */}
        {isError && (
          <View style={styles.centeredWrap}>
            <MaterialCommunityIcons name="wifi-off" size={48} color={Colors.outlineVariant} />
            <Text style={styles.errorTitle}>Couldn't load settings</Text>
            <Text style={styles.errorBody}>
              Check that the mock server is running, then try again.
            </Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()} activeOpacity={0.8}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Content ─────────────────────────────────────────────────────── */}
        {!isLoading && !isError && data && (
          <>
            {/* Member hero card */}
            <LinearGradient
              colors={[Colors.navyDark, Colors.navyLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroOrb1} />
              <View style={styles.heroOrb2} />
              <View style={styles.heroAvatar}>
                <Text style={styles.heroAvatarText}>{initials}</Text>
              </View>
              <Text style={styles.heroName}>{data.member.name}</Text>
              <View style={styles.heroMeta}>
                <MaterialCommunityIcons
                  name="card-account-details-outline"
                  size={13}
                  color={Colors.blueLight}
                />
                <Text style={styles.heroMemberId}>{data.member.memberId}</Text>
              </View>
            </LinearGradient>

            {/* ── IDENTITY ─────────────────────────────────────────────── */}
            <SectionLabel label="IDENTITY" />
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="map-marker-outline" size={18} color={Colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoFieldLabel}>Home Address</Text>
                  <Text style={styles.infoFieldValue}>{data.member.address}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => setEditingField('address')}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={17} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              <Divider />

              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="phone-outline" size={18} color={Colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoFieldLabel}>Phone Number</Text>
                  <Text style={styles.infoFieldValue}>{data.member.phone}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => setEditingField('phone')}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={17} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* ── PREFERENCES ──────────────────────────────────────────── */}
            <SectionLabel label="PREFERENCES" />
            <View style={styles.card}>
              {/* Language – display only for now */}
              <ActionRow
                icon="translate"
                label="Language"
                value={data.preferences.language}
              />

              {prefs && (
                <>
                  <Divider />
                  <PreferenceToggleRow
                    icon="email-outline"
                    label="Communication"
                    value={prefs.communicationPreference}
                    loading={updatePrefs.isPending}
                    onChange={(val) => handleTogglePref('communicationPreference', val)}
                  />
                  <Divider />
                  <PreferenceToggleRow
                    icon="file-document-outline"
                    label="EOB Statements"
                    value={prefs.eobPreference}
                    loading={updatePrefs.isPending}
                    onChange={(val) => handleTogglePref('eobPreference', val)}
                  />
                </>
              )}
            </View>

            {/* ── SECURITY ─────────────────────────────────────────────── */}
            <SectionLabel label="SECURITY" />
            <View style={styles.card}>
              <View style={styles.switchRow}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="face-recognition" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.switchLabel}>Biometric Login</Text>
                <Switch
                  value={biometricsEnabled}
                  onValueChange={handleToggleBiometrics}
                  trackColor={{ false: Colors.surfaceContainerHigh, true: Colors.primaryContainer }}
                  thumbColor={biometricsEnabled ? Colors.primary : Colors.outline}
                />
              </View>
            </View>

            {/* ── NOTIFICATIONS ────────────────────────────────────────── */}
            <SectionLabel label="NOTIFICATIONS" />
            <View style={styles.card}>
              <View style={styles.switchRow}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="bell-outline" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.switchLabel}>Push Notifications</Text>
                <Switch
                  value={pushEnabled}
                  onValueChange={setPushEnabled}
                  trackColor={{ false: Colors.surfaceContainerHigh, true: Colors.primaryContainer }}
                  thumbColor={pushEnabled ? Colors.primary : Colors.outline}
                />
              </View>
              <Divider />
              <View style={[styles.switchRow, !pushEnabled && styles.switchRowDimmed]}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="receipt-text-outline" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.switchLabel}>Claim Updates</Text>
                <Switch
                  value={pushEnabled}
                  onValueChange={setPushEnabled}
                  disabled={!pushEnabled}
                  trackColor={{ false: Colors.surfaceContainerHigh, true: Colors.primaryContainer }}
                  thumbColor={pushEnabled ? Colors.primary : Colors.outline}
                />
              </View>
              <Divider />
              <View style={[styles.switchRow, !pushEnabled && styles.switchRowDimmed]}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="pill" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.switchLabel}>Prescription Reminders</Text>
                <Switch
                  value={pushEnabled}
                  onValueChange={setPushEnabled}
                  disabled={!pushEnabled}
                  trackColor={{ false: Colors.surfaceContainerHigh, true: Colors.primaryContainer }}
                  thumbColor={pushEnabled ? Colors.primary : Colors.outline}
                />
              </View>
            </View>

            {/* ── LEGAL & FAMILY ───────────────────────────────────────── */}
            <SectionLabel label="LEGAL & FAMILY" />
            <View style={styles.card}>
              <ActionRow icon="clipboard-text-outline" label="Add Plan / Contract" />
              <Divider />
              <ActionRow icon="account-star-outline" label="Add Power of Attorney" />
            </View>

            {/* ── ABOUT & HELP ─────────────────────────────────────────── */}
            <SectionLabel label="ABOUT & HELP" />
            <View style={styles.card}>
              <ActionRow icon="help-circle-outline" label="Help Center" />
              <Divider />
              <ActionRow icon="shield-check-outline" label="Privacy Policy" />
              <Divider />
              <ActionRow icon="file-sign" label="Terms of Service" />
              <Divider />
              <ActionRow icon="star-outline" label="Rate the App" />
            </View>

            {/* ── Sign out ─────────────────────────────────────────────── */}
            <TouchableOpacity
              style={styles.signOutBtn}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Sign Out', style: 'destructive', onPress: handleSignOut },
                ])
              }
            >
              <MaterialCommunityIcons name="logout" size={20} color={Colors.error} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>

            {/* ── DANGER ZONE ─────────────────────────────────────────── */}
            <SectionLabel label="DANGER ZONE" />
            <View style={styles.card}>
              <ActionRow 
                icon="delete-sweep-outline" 
                label="Reset All Local App Data" 
                destructive 
                onPress={handleResetData}
              />
            </View>

            <Text style={styles.version}>AmeriHealth Caritas · v1.0.0</Text>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Edit modal ───────────────────────────────────────────────────── */}
      <EditFieldModal
        visible={editingField !== null}
        label={editingLabel}
        value={editingValue}
        multiline={editingField === 'address'}
        loading={updateMember.isPending}
        onSave={handleSaveField}
        onClose={() => setEditingField(null)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  headerBtn: { padding: 8, borderRadius: Radius.md },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  avatarCirclePlaceholder: { backgroundColor: Colors.surfaceContainerHigh },
  avatarText: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.onPrimary },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  // Loading / Error
  centeredWrap: { alignItems: 'center', paddingVertical: 80, gap: 12 },
  errorTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.primary },
  errorBody: { fontSize: FontSize.sm, color: Colors.onSurfaceVariant, textAlign: 'center' },
  retryBtn: {
    marginTop: 4,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  retryText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.onPrimary },

  // Hero card
  heroCard: {
    borderRadius: Radius.lg,
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 28,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: Colors.navyDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  heroOrb1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroOrb2: {
    position: 'absolute',
    bottom: -24,
    left: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroAvatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroAvatarText: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.onPrimary },
  heroName: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: Colors.onPrimary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroMemberId: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.blueLight,
    letterSpacing: 0.5,
  },

  // Section label
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionLabelText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
  },
  sectionLabelLine: {
    flex: 1,
    height: 1,
    backgroundColor: `${Colors.outlineVariant}4D`,
  },

  // Card container
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Divider (indented left to align under label text)
  divider: {
    height: 1,
    backgroundColor: `${Colors.outlineVariant}33`,
    marginLeft: 64, // icon(36) + gap(12) + card padding(16) = 64
    marginRight: -16, // extend to card right edge
  },

  // Shared icon box
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxDestructive: { backgroundColor: Colors.errorContainer },

  // Identity rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    gap: 12,
  },
  infoContent: { flex: 1 },
  infoFieldLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  infoFieldValue: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.onSurface,
    lineHeight: 20,
  },
  editBtn: {
    padding: 7,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryBg,
    marginTop: 1,
  },

  // Action rows (Language, Legal, About)
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  actionLabel: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  actionLabelDestructive: { color: Colors.error },
  actionValue: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },

  // Switch rows (Notifications)
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  switchRowDimmed: { opacity: 0.45 },
  switchLabel: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.onSurface,
  },

  // Sign out
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: Radius.lg,
    backgroundColor: Colors.errorContainer,
    marginBottom: 20,
  },
  signOutText: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.error,
  },

  version: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 8,
  },
});
