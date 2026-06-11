import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { SsoProvider } from '../../services/descope.service';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const PROVIDERS: { id: SsoProvider; label: string; icon: IconName; color: string }[] = [
  { id: 'google', label: 'Google', icon: 'google', color: '#DB4437' },
  { id: 'apple', label: 'Apple', icon: 'apple', color: '#000000' },
  { id: 'facebook', label: 'Facebook', icon: 'facebook', color: '#1877F2' },
  { id: 'microsoft', label: 'Microsoft', icon: 'microsoft', color: '#00A4EF' },
];

interface Props {
  disabled?: boolean;
  onPress: (provider: SsoProvider) => void;
}

/** 2x2 grid of social sign-in buttons shared by the Login and Register screens. */
export default function SsoProviderGrid({ disabled, onPress }: Props) {
  return (
    <View style={styles.grid}>
      {PROVIDERS.map(({ id, label, icon, color }) => (
        <TouchableOpacity
          key={id}
          style={[styles.btn, disabled && styles.btnDisabled]}
          onPress={() => onPress(id)}
          disabled={disabled}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Continue with ${label}`}
          testID={`sso-${id}-button`}
        >
          <MaterialCommunityIcons name={icon} size={20} color={color} />
          <Text style={styles.btnText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  btn: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#003461', fontSize: 15, fontWeight: '700' },
});
