import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Switch,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProviderAvatar } from '../components/ProviderAvatar';
import { SmartFiltersModal, FilterState } from '../components/SmartFiltersModal';
import { Colors, useProviders } from '@medicare/shared';
import type { ProviderData } from '@medicare/shared';
import type { FindCareScreenProps } from '../navigation/types';

const { height: SCREEN_H } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


const MAP_REGION = {
  latitude: 39.9526,
  longitude: -75.1652,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

const MEMBER_ADDRESS = {
  latitude: 39.9526,
  longitude: -75.1652,
};

const SORT_OPTIONS = ['Recommended', 'Distance', 'Rating'] as const;

// Stable pseudo review count derived from provider id — no reviewCount field in API
function deriveReviewCount(provider: ProviderData): number {
  const hash = provider.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return (hash % 180) + 50;
}

// ─── Arc motif ────────────────────────────────────────────────────────────────
function ArcMotif() {
  return <View style={styles.arcMotif} />;
}

// ─── Smart Match banner card ──────────────────────────────────────────────────
function SmartMatchCard({
  provider,
  onPress,
}: {
  provider: ProviderData;
  onPress: () => void;
}) {
  return (
    <View style={styles.smartCard}>
      {/* SMART MATCH tab */}
      <View style={styles.smartBadge}>
        <MaterialCommunityIcons name="check-decagram" size={11} color={Colors.secondaryContainer} />
        <Text style={styles.smartBadgeText}>SMART MATCH</Text>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.avatarWrap}>
          <ProviderAvatar name={provider.name} category={provider.category} photoUrl={provider.photo} size={64} />
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.smartProviderName} numberOfLines={1}>{provider.name}</Text>
            {provider.inNetwork && (
              <View style={styles.networkBadge}>
                <Text style={styles.networkBadgeText}>IN-NETWORK</Text>
              </View>
            )}
          </View>
          <View style={styles.specialtyRow}>
            <MaterialCommunityIcons name="medical-bag" size={13} color={Colors.secondaryContainer} />
            <Text style={styles.smartSpecialtyText} numberOfLines={1}>
              {provider.specialty}
              {provider.yearsExperience != null ? ` · ${provider.yearsExperience} yrs exp` : ''}
            </Text>
          </View>
          <View style={styles.specialtyRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={13} color={Colors.secondaryContainer} />
            <Text style={styles.smartSpecialtyText} numberOfLines={1}>
              {provider.address}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="star" size={12} color={Colors.secondaryContainer} />
              <Text style={styles.smartMetaRating}>{provider.rating.toFixed(1)}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="navigation" size={12} color="rgba(255,255,255,0.6)" />
              <Text style={styles.smartMetaDistance}>{provider.distance.toFixed(1)} mi</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Confidence bar */}
      <View style={styles.confidenceRow}>
        <View style={styles.confidenceTrack}>
          <View style={[styles.confidenceFill, { width: `${Math.round(provider.rating / 5 * 100)}%` }]} />
        </View>
        <Text style={styles.confidenceLabel}>
          {Math.round(provider.rating / 5 * 100)}% Match Confidence
        </Text>
      </View>

      <TouchableOpacity style={styles.smartViewBtn} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.smartViewBtnText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Provider Card ────────────────────────────────────────────────────────────
const ProviderCard = React.memo(function ProviderCard({
  provider,
  onPress,
  testID,
}: {
  provider: ProviderData;
  onPress: () => void;
  testID?: string;
}) {
  const reviewNum = deriveReviewCount(provider);
  const bilingual = provider.languages && provider.languages.length > 1;

  return (
    <View style={styles.card} testID={testID}>
      <ArcMotif />
      <View style={styles.cardRow}>
        <View style={styles.avatarWrap}>
          <ProviderAvatar name={provider.name} category={provider.category} photoUrl={provider.photo} size={64} />
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.providerName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
              {provider.name}
            </Text>
            {provider.inNetwork && (
              <View style={styles.networkBadge}>
                <Text style={styles.networkBadgeText}>IN-NETWORK</Text>
              </View>
            )}
          </View>
          <View style={styles.specialtyRow}>
            <MaterialCommunityIcons name="medical-bag" size={13} color={Colors.secondary} />
            <Text style={styles.specialtyText} numberOfLines={1}>
              {provider.specialty}
              {bilingual ? ' • Bilingual' : ''}
            </Text>
          </View>
          <View style={styles.specialtyRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={13} color={Colors.outline} />
            <Text style={styles.addressText} numberOfLines={1}>
              {provider.address}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="star" size={12} color={Colors.tertiary} />
              <Text style={styles.metaRating}>
                {provider.rating.toFixed(1)} ({reviewNum})
              </Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="navigation" size={12} color={Colors.outline} />
              <Text style={styles.metaDistance}>{provider.distance.toFixed(1)} mi</Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.viewBtn} onPress={onPress} activeOpacity={0.85}
        accessibilityLabel="View Details Button"
        accessibilityRole="button">
        <Text style={styles.viewBtnText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
});

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  const opacity = React.useRef(new Animated.Value(0.4)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);
  return (
    <Animated.View style={[styles.card, styles.skeletonCard, { opacity }]}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonLines}>
        <View style={[styles.skeletonLine, { width: '60%' }]} />
        <View style={[styles.skeletonLine, { width: '40%', marginTop: 6 }]} />
        <View style={[styles.skeletonLine, { width: '30%', marginTop: 6 }]} />
      </View>
    </Animated.View>
  );
}

import TopBar from '../components/TopBar';

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function FindCareScreen({ navigation }: FindCareScreenProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortIndex, setSortIndex] = useState(0);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ category: 'All' });

  // Animation state for the map pin selection
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [displayProvider, setDisplayProvider] = useState<ProviderData | null>(null);

  const [isSearchMinimized, setIsSearchMinimized] = useState(false);

  const toggleMinimize = (minimize: boolean) => {
    if (isSearchMinimized !== minimize) {
      LayoutAnimation.configureNext({
        duration: 400,
        create: { type: LayoutAnimation.Types.spring, property: LayoutAnimation.Properties.opacity, springDamping: 0.8 },
        update: { type: LayoutAnimation.Types.spring, springDamping: 0.8 },
        delete: { type: LayoutAnimation.Types.spring, property: LayoutAnimation.Properties.opacity, springDamping: 0.8 },
      });
      setIsSearchMinimized(minimize);
    }
  };

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 40 && !isSearchMinimized) {
      toggleMinimize(true);
    } else if (y <= 0 && isSearchMinimized) {
      toggleMinimize(false);
    }
  };

  // ── Data layer: mirrors web FindCare.tsx exactly ──────────────────────────
  // Fetch ALL providers with no server-side params; all filtering is client-side.
  // This matches the web pattern: useProviders({}, { enabled: true })
  const { data: allProviders = [], isLoading } = useProviders({}, { enabled: true });

  // Smart Match = highest-rated in-network provider from the full pool (same as web)
  const smartMatch = useMemo<ProviderData | null>(() => {
    const inNet = allProviders.filter((p) => p.inNetwork);
    const pool = inNet.length > 0 ? inNet : allProviders;
    if (pool.length === 0) return null;
    return pool.reduce((best, p) => (p.rating > best.rating ? p : best), pool[0]);
  }, [allProviders]);

  // Client-side filter + sort, excluding Smart Match from the list (same as web)
  const filteredProviders = useMemo(() => {
    let result = allProviders.filter((p) => p.id !== smartMatch?.id);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.specialty.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.locations && p.locations.some(loc => loc.address.toLowerCase().includes(q))),
      );
    }

    if (filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category || p.specialty === filters.category);
    }
    if (filters.inNetwork !== undefined) {
      result = result.filter(p => p.inNetwork === filters.inNetwork);
    }
    if (filters.language !== undefined) {
      result = result.filter(p => p.languages && p.languages.includes(filters.language!));
    }
    if (filters.minRating !== undefined) {
      result = result.filter(p => p.rating >= filters.minRating!);
    }
    if (filters.maxDistance !== undefined) {
      result = result.filter(p => p.distance <= filters.maxDistance!);
    }

    if (sortIndex === 1) result = [...result].sort((a, b) => a.distance - b.distance);
    else if (sortIndex === 2) result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [allProviders, smartMatch, query, sortIndex, filters]);

  const activeFiltersCount =
    (query.trim().length > 0 ? 1 : 0) +
    (filters.category !== 'All' ? 1 : 0) +
    (filters.inNetwork !== undefined ? 1 : 0) +
    (filters.language !== undefined ? 1 : 0) +
    (filters.minRating !== undefined ? 1 : 0) +
    (filters.maxDistance !== undefined ? 1 : 0);

  const selectedProvider = useMemo(() => {
    return filteredProviders.find(p => p.id === selectedProviderId) || null;
  }, [filteredProviders, selectedProviderId]);

  useEffect(() => {
    if (selectedProvider) {
      setDisplayProvider(selectedProvider);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start(({ finished }) => {
        if (finished) setDisplayProvider(null);
      });
    }
  }, [selectedProvider, slideAnim, fadeAnim]);

  function navigateToDetail(provider: ProviderData) {
    navigation.navigate('ProviderDetail', {
      providerId: provider.id,
      providerName: provider.name,
    });
  }

  const renderItem = useCallback(({ item, index }: { item: ProviderData; index: number }) => (
    <ProviderCard provider={item} onPress={() => navigateToDetail(item)} testID={`provider-card-${index}`} />
  ), []);

  const keyExtractor = useCallback((item: ProviderData) => item.id, []);

  const listHeader = useMemo(() => {
    if (!activeFiltersCount || isLoading) return null;
    return (
      <>
        {smartMatch && (
          <View style={styles.listHeaderSection}>
            <Text style={styles.sectionLabel}>Smart Match For You</Text>
            <SmartMatchCard provider={smartMatch} onPress={() => navigateToDetail(smartMatch)} />
          </View>
        )}
        <Text style={styles.countLabel}>
          {filteredProviders.length} Provider{filteredProviders.length !== 1 ? 's' : ''} near you
        </Text>
      </>
    );
  }, [activeFiltersCount, isLoading, smartMatch, filteredProviders.length]);

  const listEmpty = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.listSection}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      );
    }
    if (!activeFiltersCount) {
      return (
        <View style={styles.emptyWrap}>
          <MaterialCommunityIcons name="magnify" size={48} color={Colors.outlineVariant} />
          <Text style={[styles.emptyTitle, { color: Colors.onSurfaceVariant, marginTop: 16 }]}>Search to find care</Text>
          <Text style={styles.emptySub}>Enter a provider name, specialty, or use filters to discover healthcare options near you.</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyWrap}>
        <MaterialCommunityIcons name="account-search-outline" size={48} color={Colors.onSurfaceVariant} />
        <Text style={styles.emptyTitle}>No providers found</Text>
        <Text style={styles.emptySub}>Try a different search term or clear the field.</Text>
      </View>
    );
  }, [isLoading, activeFiltersCount]);

  return (
    <View style={styles.root} accessibilityLabel="find-care-screen">
      <View style={{ paddingTop: insets.top }} />
      <TopBar />
      {/* ══ Fixed header — hero + map + controls (never scrolls) ════════════ */}
      <View style={styles.stableHeader}>
        <Text style={styles.navTitle}>Find Care</Text>
        <Text style={styles.pageSubtitle}>Your first step towards care.</Text>
      </View>
      <View>
        {/* ── Hero ─────────────────────────────────────────── */}
        <View style={[styles.heroCard, isSearchMinimized && { padding: 16, paddingTop: 16 }]}>
          <View style={styles.heroGlow} />
          {!isSearchMinimized && (
            <Text style={styles.heroTitle}>How can we help you{'\n'}feel better today?</Text>
          )}
          <View style={[styles.searchBar, isSearchMinimized && { marginBottom: 0 }]}>
            <MaterialCommunityIcons name="auto-fix" size={18} color="rgba(255,255,255,0.55)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="I need a doctor..."
              placeholderTextColor="rgba(255,255,255,0.45)"
              value={query}
              onChangeText={setQuery}
              onFocus={() => toggleMinimize(false)}
              returnKeyType="search"
              selectionColor="rgba(255,255,255,0.7)"
              testID="provider-search-input"
            />
            <TouchableOpacity style={styles.askAiBtn} activeOpacity={0.85}>
              <Text style={styles.askAiText}>Ask AI</Text>
            </TouchableOpacity>
          </View>
          {!isSearchMinimized && (
            <View style={styles.suggestRow}>
              <Text style={styles.suggestLabel}>Try:</Text>
              {['"Senior cardiology"', '"Spanish therapists"'].map((chip) => (
                <TouchableOpacity
                  key={chip}
                  style={styles.suggestChip}
                  onPress={() => setQuery(chip.replace(/"/g, ''))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.suggestChipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ── Controls bar ─────────────────────────────────── */}
        <View style={styles.controlsBar}>
          <TouchableOpacity style={styles.filtersBtn} activeOpacity={0.85} onPress={() => setIsFilterModalVisible(true)}>
            <MaterialCommunityIcons name="tune-variant" size={16} color={Colors.secondary} />
            <Text style={styles.filtersBtnText}>Filters</Text>
            {activeFiltersCount > 0 && (
              <View style={styles.filtersBadge}>
                <Text style={styles.filtersBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.divider} />

          <View style={styles.viewToggleGroup}>
            <TouchableOpacity
              style={[styles.viewToggleBtn, viewMode === 'list' && styles.viewToggleBtnActive]}
              onPress={() => setViewMode('list')}
            >
              <MaterialCommunityIcons name="format-list-bulleted" size={16} color={viewMode === 'list' ? Colors.white : Colors.onSurfaceVariant} />
              <Text style={[styles.viewToggleText, viewMode === 'list' && styles.viewToggleTextActive]}>List</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewToggleBtn, viewMode === 'map' && styles.viewToggleBtnActive]}
              onPress={() => setViewMode('map')}
            >
              <MaterialCommunityIcons name="map-outline" size={16} color={viewMode === 'map' ? Colors.white : Colors.onSurfaceVariant} />
              <Text style={[styles.viewToggleText, viewMode === 'map' && styles.viewToggleTextActive]}>Map</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.sortBtn} onPress={() => setSortIndex((i) => (i + 1) % SORT_OPTIONS.length)} activeOpacity={0.8}>
            <Text style={styles.sortBtnText}>{SORT_OPTIONS[sortIndex]}</Text>
            <MaterialCommunityIcons name="chevron-down" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ══ Content Area (List or Map) ════════ */}
      {viewMode === 'map' ? (
        <View style={styles.fullMapSection}>
          <MapView
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={MAP_REGION}
            showsUserLocation={false}
            showsMyLocationButton={false}
            onPanDrag={() => {
              if (!isSearchMinimized) toggleMinimize(true);
            }}
            onPress={() => {
              setSelectedProviderId(null);
              if (!isSearchMinimized) toggleMinimize(true);
            }}
          >
            {/* Member Home Location */}
            <Marker coordinate={MEMBER_ADDRESS} zIndex={100} tracksViewChanges={false}>
              <View style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: Colors.primary,
                borderWidth: 3,
                borderColor: Colors.white,
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 5
              }} />
            </Marker>

            {/* Radius Circle if selected */}
            {filters.maxDistance && (
              <Circle
                center={MEMBER_ADDRESS}
                radius={filters.maxDistance * 1609.34} // Convert miles to meters
                fillColor="rgba(0, 52, 97, 0.1)"
                strokeColor="rgba(0, 52, 97, 0.3)"
                strokeWidth={2}
              />
            )}

            {activeFiltersCount > 0 && filteredProviders.map((p) => (
              <Marker
                key={p.id}
                coordinate={p.coordinate}
                pinColor={p.inNetwork ? Colors.primary : Colors.secondary}
                onPress={(e) => {
                  e.stopPropagation();
                  setSelectedProviderId(p.id);
                }}
              />
            ))}
          </MapView>

          <View style={styles.mapControlsFloat}>
            {(['crosshairs-gps', 'plus', 'minus'] as const).map((icon) => (
              <TouchableOpacity key={icon} style={styles.mapCtrlBtn} activeOpacity={0.85}>
                <MaterialCommunityIcons name={icon} size={20} color={Colors.primary} />
              </TouchableOpacity>
            ))}
          </View>

          <Animated.View
            style={[
              styles.floatingProviderCard,
              {
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim,
                pointerEvents: selectedProvider ? 'auto' : 'none'
              }
            ]}
          >
            {displayProvider && (
              <ProviderCard provider={displayProvider} onPress={() => navigateToDetail(displayProvider)} />
            )}
          </Animated.View>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          testID="provider-list"
          data={isLoading || !activeFiltersCount ? [] : filteredProviders}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          ListFooterComponent={<View style={{ height: 100 }} />}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          onScroll={handleScroll}
          removeClippedSubviews
        />
      )}

      <SmartFiltersModal
        visible={isFilterModalVisible}
        initialFilters={filters}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setIsFilterModalVisible(false);
        }}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  stableHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
  },
  navTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  listHeaderSection: { marginBottom: 14 },

  // ── Hero
  heroCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(65,190,253,0.18)',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.3,
    lineHeight: 32,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    height: 52,
    marginBottom: 12,
  },
  searchIcon: { marginHorizontal: 12 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
    paddingVertical: 0,
  },
  askAiBtn: {
    backgroundColor: Colors.secondaryContainer,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 6,
  },
  askAiText: {
    color: Colors.onSecondaryContainer,
    fontWeight: '700',
    fontSize: 13,
  },
  suggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  suggestChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  suggestChipText: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },

  // ── Map
  fullMapSection: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    position: 'relative',
  },
  map: { flex: 1 },
  mapControlsFloat: { position: 'absolute', top: 16, right: 14, gap: 8 },
  floatingProviderCard: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  mapCtrlBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  // ── Controls bar
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filtersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filtersBtnText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  filtersBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 99,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filtersBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
  divider: { width: 1, height: 28, backgroundColor: `${Colors.outlineVariant}60` },
  viewToggleGroup: { flexDirection: 'row', backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, padding: 4 },
  viewToggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  viewToggleBtnActive: { backgroundColor: Colors.primary },
  viewToggleText: { fontSize: 12, fontWeight: '700', color: Colors.onSurfaceVariant },
  viewToggleTextActive: { color: Colors.white },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: 'auto' },
  sortBtnText: { fontSize: 14, fontWeight: '700', color: Colors.primary },

  // ── Provider list
  listSection: { paddingTop: 8 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  countLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 2,
    paddingHorizontal: 4,
  },

  // ── Smart Match card
  smartCard: {
    backgroundColor: Colors.primary,
    borderRadius: 32,
    padding: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 16,
  },
  smartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(65,190,253,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 16,
  },
  smartBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.secondaryContainer,
    letterSpacing: 0.8,
  },
  smartProviderName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.white,
    flexShrink: 1,
  },
  smartSpecialtyText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    flex: 1,
  },
  smartMetaRating: { fontSize: 11, fontWeight: '700', color: Colors.secondaryContainer },
  smartMetaDistance: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    marginBottom: 4,
  },
  confidenceTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.secondaryContainer,
  },
  confidenceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  smartViewBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 14,
  },
  smartViewBtnText: { color: Colors.white, fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },

  // ── Regular provider card
  card: {
    backgroundColor: Colors.white,
    borderRadius: 32,
    padding: 20,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  arcMotif: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopRightRadius: 32,
    backgroundColor: 'rgba(0,101,141,0.05)',
  },
  cardRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  avatarWrap: {
    flexShrink: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  cardInfo: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  providerName: { fontSize: 17, fontWeight: '800', color: Colors.primary, flexShrink: 1 },
  networkBadge: {
    backgroundColor: 'rgba(0,101,141,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  networkBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: Colors.secondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  specialtyRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  specialtyText: { fontSize: 12, fontWeight: '600', color: Colors.onSurfaceVariant, flex: 1 },
  addressText: { fontSize: 11, fontWeight: '500', color: Colors.onSurfaceVariant, flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 2 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaRating: { fontSize: 11, fontWeight: '700', color: Colors.tertiary },
  metaDistance: { fontSize: 11, fontWeight: '600', color: Colors.outline },
  viewBtn: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 16,
  },
  viewBtnText: { color: Colors.white, fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },

  // ── Skeleton
  skeletonCard: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  skeletonAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.surfaceContainerHigh, flexShrink: 0 },
  skeletonLines: { flex: 1, paddingTop: 8 },
  skeletonLine: { height: 12, borderRadius: 6, backgroundColor: Colors.surfaceContainerHigh },

  // ── Empty state
  emptyWrap: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: Colors.primary, textAlign: 'center' },
  emptySub: { fontSize: 13, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 20 },
});
