import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, FontSize, Shadows } from '@medicare/shared';

type MciName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  /** Trailing icon name from MaterialCommunityIcons */
  icon?: MciName;
  /** solid = filled primary; outline = white + border; ghost = surface bg */
  variant?: 'solid' | 'outline' | 'ghost';
  style?: StyleProp<ViewStyle>;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  icon,
  variant = 'solid',
  style,
}) => {
  const iconColor = variant === 'solid' ? Colors.white : Colors.primary;

  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, variant !== 'solid' && styles.labelAlt]}>{label}</Text>
      {icon && <MaterialCommunityIcons name={icon} size={18} color={iconColor} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  solid: {
    backgroundColor: Colors.primary,
    ...Shadows.button,
  },
  outline: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  ghost: {
    backgroundColor: Colors.surfaceContainerLow,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.white,
  },
  labelAlt: {
    color: Colors.primary,
  },
});

export default PrimaryButton;
