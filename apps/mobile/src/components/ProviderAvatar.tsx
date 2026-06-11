import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface Theme {
  colors: [string, string];
  icon: IconName;
}

const SPECIALTY_THEME: Record<string, Theme> = {
  'Primary Care':      { colors: ['#003461', '#1D6FA4'], icon: 'stethoscope' },
  'Family Medicine':   { colors: ['#003461', '#1D6FA4'], icon: 'stethoscope' },
  'Cardiology':        { colors: ['#7F1D1D', '#C0392B'], icon: 'heart-pulse' },
  'Internal Medicine': { colors: ['#065F46', '#0D9B6A'], icon: 'medical-bag' },
  'Physical Therapy':  { colors: ['#713F12', '#C67A1D'], icon: 'run-fast' },
  'Dermatology':       { colors: ['#4C1D95', '#7C3AED'], icon: 'bottle-tonic-outline' },
  'Orthopedics':       { colors: ['#0C4A6E', '#0284C7'], icon: 'bone' },
  'Neurology':         { colors: ['#1E1B4B', '#4338CA'], icon: 'brain' },
  'Gastroenterology':  { colors: ['#134E4A', '#0F9488'], icon: 'pill' },
  'Psychiatry':        { colors: ['#831843', '#BE185D'], icon: 'head-lightbulb-outline' },
  'Ophthalmology':     { colors: ['#164E63', '#0891B2'], icon: 'eye' },
};

const FALLBACK_THEME: Theme = { colors: ['#1E3A5F', '#2563EB'], icon: 'medical-bag' };

interface ProviderAvatarProps {
  name: string;
  category: string;
  photoUrl?: string;
  size?: number;
}

export function ProviderAvatar({ name, category, photoUrl, size = 64 }: ProviderAvatarProps) {
  const clean = name.replace(/^Dr\.?\s+/i, '').trim().split(/\s+/);
  const initials = ((clean[0]?.[0] ?? '') + (clean[1]?.[0] ?? '')).toUpperCase();

  const { colors, icon } = SPECIALTY_THEME[category] ?? FALLBACK_THEME;

  const radius = size / 2;
  const badgeSize = Math.round(size * 0.36);
  const badgeRadius = Math.round(badgeSize * 0.32);
  const iconSize = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.3);

  return (
    <View style={[styles.wrapper, { width: size, height: size, borderRadius: radius }]}>
      <View style={[styles.root, { width: size, height: size, borderRadius: radius }]}>
                  <Image source={require('../assets/doctor_icons/male_doctor.png')} style={{ width: size, height: size, borderRadius: radius }} />
      </View>

      {/* Specialty icon badge — bottom-right */}
      <View style={[
        styles.badge,
        { width: badgeSize, height: badgeSize, borderRadius: badgeRadius, bottom: size * 0.05, right: size * 0.05 },
      ]}>
        <MaterialCommunityIcons name={icon} size={iconSize} color="rgba(255,255,255,0.95)" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#e2e5ec',
  },
  root: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  initials: {
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  badge: {
    position: 'absolute',
    backgroundColor: 'rgba(0,52,97,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
});
