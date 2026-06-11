import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSize, Radius } from '@medicare/shared';
import type { NotificationItem, NotificationType } from '@medicare/shared';

interface IconConfig {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  bg: string;
  color: string;
}

const ICON_MAP: Record<NotificationType, IconConfig> = {
  wellness:     { icon: 'water-outline',          bg: Colors.secondaryContainer, color: Colors.onSecondaryContainer },
  appointment:  { icon: 'calendar-check',          bg: Colors.primaryFixed,       color: Colors.primaryContainer },
  claim:        { icon: 'receipt-text-outline',    bg: Colors.tertiaryFixed,      color: Colors.tertiary },
  security:     { icon: 'shield-alert-outline',    bg: Colors.errorContainer,     color: Colors.error },
  prescription: { icon: 'pill',                    bg: Colors.secondaryFixed,     color: Colors.secondary },
};

const FALLBACK_ICON: IconConfig = {
  icon: 'bell-outline',
  bg: Colors.surfaceContainerHigh,
  color: Colors.onSurfaceVariant,
};

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export interface NotificationCardProps {
  item: NotificationItem;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationCard({ item, onMarkRead, onDelete }: NotificationCardProps) {
  const iconCfg = ICON_MAP[item.type as NotificationType] ?? FALLBACK_ICON;

  return (
    <View style={[styles.card, item.read && styles.cardRead]}>
      <View style={[styles.inner, item.read && styles.innerRead]}>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: iconCfg.bg }]}>
            <MaterialCommunityIcons name={iconCfg.icon} size={22} color={iconCfg.color} />
          </View>

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              {!item.read && <View style={styles.unreadDot} />}
            </View>

            <Text style={styles.body}>{item.body}</Text>

            <View style={styles.footer}>
              <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
              <View style={styles.actions}>
                {!item.read && (
                  <TouchableOpacity
                    style={styles.markReadBtn}
                    onPress={() => onMarkRead(item.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.markReadText}>Mark as Read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => onDelete(item.id)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="delete-outline" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    padding: 16,
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
  },
  cardRead: {
    backgroundColor: `${Colors.surfaceContainerLow}CC`,
    shadowOpacity: 0.02,
    elevation: 1,
  },
  inner: {},
  innerRead: { opacity: 0.75 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.onSurface,
    lineHeight: 22,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondary,
    flexShrink: 0,
    marginTop: 6,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  body: {
    fontSize: FontSize.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.outline,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  markReadBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  markReadText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
  deleteBtn: {
    padding: 6,
    borderRadius: Radius.sm,
  },
});
