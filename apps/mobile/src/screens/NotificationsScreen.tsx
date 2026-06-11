import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSize, Radius, useNotifications } from '@medicare/shared';
import type { NotificationItem } from '@medicare/shared';
import NotificationCard from '../components/notifications/NotificationCard';
import { groupNotifications } from '../utils/groupNotifications';
import LoadingSkeleton from '../components/LoadingSkeleton';

function SectionHeader({ label }: { label: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { data: serverNotifications, isLoading, isError, refetch } = useNotifications();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Handle Android hardware back button
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true; // prevent default (exit app)
      }
      return false;
    });
    return () => subscription.remove();
  }, [navigation]);

  function handleBack() {
    if (navigation.canGoBack()) navigation.goBack();
  }

  // Optimistic local overrides: deleted ids and read ids
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifications = useMemo<NotificationItem[]>(() => {
    if (!serverNotifications) return [];
    return serverNotifications
      .filter((n) => !deletedIds.has(n.id))
      .map((n) => (readIds.has(n.id) ? { ...n, read: true } : n));
  }, [serverNotifications, deletedIds, readIds]);

  const groups = useMemo(() => groupNotifications(notifications), [notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  function handleMarkRead(id: string) {
    setReadIds((prev) => new Set(prev).add(id));
  }

  function handleDelete(id: string) {
    setDeletedIds((prev) => new Set(prev).add(id));
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surfaceContainerLowest} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={handleBack} activeOpacity={0.8}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.8}>
          <MaterialCommunityIcons name="cog-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Hero Banner */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryContainer]}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />
          <MaterialCommunityIcons
            name="bell-ring-outline"
            size={48}
            color="rgba(255,255,255,0.12)"
            style={styles.heroBgIcon}
          />
          <Text style={styles.heroText}>Stay updated with{'\n'}your care journey.</Text>
        </LinearGradient>

        {isLoading && (
          <View style={styles.skeletonWrap}>
            <LoadingSkeleton style={styles.skeletonItem} />
            <LoadingSkeleton style={styles.skeletonItem} />
            <LoadingSkeleton style={styles.skeletonItem} />
          </View>
        )}

        {isError && (
          <View style={styles.centeredWrap}>
            <MaterialCommunityIcons name="wifi-off" size={48} color={Colors.outlineVariant} />
            <Text style={styles.errorTitle}>Couldn't load notifications</Text>
            <Text style={styles.errorBody}>Check that the mock server is running, then try again.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()} activeOpacity={0.8}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && !isError && groups.map((group) => (
          <View key={group.label} style={styles.section}>
            <SectionHeader label={group.label} />
            {group.items.map((item) => (
              <NotificationCard
                key={item.id}
                item={item}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))}
          </View>
        ))}

        {!isLoading && !isError && groups.length === 0 && (
          <View style={styles.centeredWrap}>
            <MaterialCommunityIcons name="bell-check-outline" size={56} color={Colors.outlineVariant} />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyBody}>You have no notifications at this time.</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  headerBtn: { padding: 8, borderRadius: Radius.md },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  headerBadge: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  headerBadgeText: {
    color: Colors.onPrimary,
    fontSize: FontSize.xs,
    fontWeight: '800',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingTop: 16, paddingHorizontal: 16 },

  hero: {
    borderRadius: Radius.lg,
    padding: 28,
    marginBottom: 28,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  heroCircle1: {
    position: 'absolute',
    top: -32,
    right: -32,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(65,190,253,0.15)',
  },
  heroCircle2: {
    position: 'absolute',
    bottom: -20,
    left: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroBgIcon: { position: 'absolute', right: 24, bottom: 20 },
  heroText: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.onPrimary,
    lineHeight: 32,
    letterSpacing: -0.3,
  },

  skeletonWrap: { gap: 12 },
  skeletonItem: { height: 100, borderRadius: 16 },

  centeredWrap: { alignItems: 'center', paddingVertical: 60, gap: 12 },

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

  section: { marginBottom: 28, gap: 12 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: `${Colors.outlineVariant}4D`,
  },

  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.primary },
  emptyBody: {
    fontSize: FontSize.sm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
