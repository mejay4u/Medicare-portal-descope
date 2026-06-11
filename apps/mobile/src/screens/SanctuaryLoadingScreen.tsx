import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const BRAND_NAVY   = '#003461';
const BRAND_BLUE   = '#004B87';
const BRAND_CYAN   = '#00658d';
const ACCENT_CYAN  = '#41befd';
const SURFACE      = '#f8f9fa';
const MUTED        = '#727781';
const DIVIDER      = '#c2c6d1';

const TRUST_ITEMS = [
  { icon: 'shield-lock-outline',    label: 'SECURE'    },
  { icon: 'flower-tulip-outline',   label: 'WELLNESS'  },
  { icon: 'check-decagram-outline', label: 'VERIFIED'  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export default function SanctuaryLoadingScreen() {
  const insets = useSafeAreaInsets();

  // Progress bar — 0 → 1 over 2 600 ms, ease-in-out
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Pulsing dot opacity
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Subtle scale breathe on logo glow
  const glowAnim = useRef(new Animated.Value(1)).current;

  // Fade-in of the whole screen
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade the screen in quickly
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2600,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false, // width-based, can't use native driver
    }).start();

    // Pulsing dot loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.2, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 700, useNativeDriver: true }),
      ]),
    ).start();

    // Glow breathe loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1.15, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 1,    duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fadeIn }]}>
      {/* ── Mesh background ── */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* top-left radial blob */}
        <LinearGradient
          colors={['rgba(0,75,135,0.18)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.blobTopLeft}
        />
        {/* top-right radial blob */}
        <LinearGradient
          colors={['rgba(65,190,253,0.15)', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.blobTopRight}
        />
        {/* bottom-right blob */}
        <LinearGradient
          colors={['rgba(0,101,141,0.12)', 'transparent']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.blobBottomRight}
        />
        {/* center ambient arc */}
        <View style={styles.arcBlur} />
      </View>

      {/* ── Main content ── */}
      <View style={[styles.canvas, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}>

        {/* Logo block */}
        <View style={styles.logoSection}>
          {/* Glow ring behind icon */}
          <Animated.View style={[styles.glowRing, { transform: [{ scale: glowAnim }] }]} />
          <View style={styles.iconShield}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={{ width: 100, height: 100, borderRadius: 20 }} 
              resizeMode="contain"
            />
          </View>
          <Text style={styles.orgLabel}>Member Portal</Text>
          <Text style={styles.stateLabel}>Healthcare Sanctuary</Text>
        </View>

        {/* Editorial headline */}
        <View style={styles.headlineSection}>
          <Text style={styles.headline}>Member Portal</Text>
          <Text style={styles.tagline}>Your Health Journey is looking great</Text>
        </View>

        {/* Progress stack */}
        <View style={styles.progressSection}>
          {/* Track */}
          <View style={styles.progressTrack}>
            {/* Glowing fill */}
            <Animated.View style={[styles.progressFillWrapper, { width: progressWidth }]}>
              <LinearGradient
                colors={[BRAND_NAVY, ACCENT_CYAN]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressFill}
              />
            </Animated.View>
          </View>

          {/* Status row */}
          <View style={styles.statusRow}>
            <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
            <Text style={styles.statusText}>PREPARING YOUR SANCTUARY</Text>
          </View>
        </View>

        {/* Trust pillars */}
        <View style={styles.pillarsWrapper}>
          {/* Decorative divider label */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>THE DIGITAL SANCTUARY</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.pillarsRow}>
            {TRUST_ITEMS.map(({ icon, label }, i) => (
              <React.Fragment key={label}>
                <View style={styles.pillar}>
                  <MaterialCommunityIcons name={icon as any} size={26} color={`rgba(0,52,97,0.45)`} />
                  <Text style={styles.pillarLabel}>{label}</Text>
                </View>
                {i < TRUST_ITEMS.length - 1 && <View style={styles.pillarDivider} />}
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SURFACE,
  },

  // ── Background blobs ──
  blobTopLeft: {
    position: 'absolute',
    top: -height * 0.15,
    left: -width * 0.2,
    width: width * 0.85,
    height: height * 0.6,
    borderRadius: width * 0.5,
  },
  blobTopRight: {
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.25,
    width: width * 0.8,
    height: height * 0.55,
    borderRadius: width * 0.5,
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: -height * 0.1,
    right: -width * 0.1,
    width: width * 0.7,
    height: height * 0.45,
    borderRadius: width * 0.5,
  },
  arcBlur: {
    position: 'absolute',
    top: '15%',
    left: '50%',
    marginLeft: -width * 0.75,
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(0,75,135,0.04)',
  },

  // ── Layout ──
  canvas: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },

  // ── Logo ──
  logoSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  glowRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(65,190,253,0.12)',
    // second ambient ring via box shadow approximation
    shadowColor: ACCENT_CYAN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 0,
  },
  iconShield: {
    marginBottom: 10,
  },
  orgLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND_NAVY,
    letterSpacing: 0.2,
  },
  stateLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: BRAND_CYAN,
    marginTop: 2,
  },

  // ── Headline ──
  headlineSection: {
    alignItems: 'center',
    marginBottom: 52,
    gap: 10,
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: BRAND_NAVY,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 17,
    fontWeight: '500',
    color: BRAND_CYAN,
    textAlign: 'center',
    opacity: 0.9,
  },

  // ── Progress ──
  progressSection: {
    width: '100%',
    gap: 18,
    marginBottom: 52,
  },
  progressTrack: {
    height: 6,
    width: '100%',
    backgroundColor: '#e1e3e4',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFillWrapper: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
    // Glow effect
    shadowColor: ACCENT_CYAN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  progressFill: {
    flex: 1,
    borderRadius: 3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: BRAND_CYAN,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: MUTED,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // ── Trust pillars ──
  pillarsWrapper: {
    width: '100%',
    gap: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: DIVIDER,
    opacity: 0.5,
  },
  dividerLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: MUTED,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  pillarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillar: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  pillarLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: MUTED,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  pillarDivider: {
    width: 1,
    height: 36,
    backgroundColor: DIVIDER,
    opacity: 0.4,
  },
});
