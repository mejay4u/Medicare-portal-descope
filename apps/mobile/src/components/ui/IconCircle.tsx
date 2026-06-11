import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@medicare/shared';

type MciName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface IconCircleProps {
  icon: MciName;
  /** Outer circle diameter */
  size?: number;
  iconSize?: number;
  bg?: string;
  color?: string;
}

const IconCircle: React.FC<IconCircleProps> = ({
  icon,
  size = 40,
  iconSize = 20,
  bg = Colors.surfaceContainerLow,
  color = Colors.primary,
}) => (
  <View
    style={[
      styles.circle,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
    ]}
  >
    <MaterialCommunityIcons name={icon} size={iconSize} color={color} />
  </View>
);

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});

export default IconCircle;
