import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, FontSize } from '@medicare/shared';
import { useActionAlert } from '@medicare/shared';

const ICON_MAP: Record<string, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  bell: 'bell',
};

const ActionAlertBanner: React.FC = () => {
  const { data } = useActionAlert();

  if (!data) return null;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: data.backgroundColor }]}
      activeOpacity={0.85}
    >
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons
          name={ICON_MAP[data.icon] ?? 'alert-circle'}
          size={20}
          color={data.iconColor}
        />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.body}>{data.body}</Text>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={20} color="rgba(255,255,255,0.8)" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  body: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 17,
  },
});

export default ActionAlertBanner;
