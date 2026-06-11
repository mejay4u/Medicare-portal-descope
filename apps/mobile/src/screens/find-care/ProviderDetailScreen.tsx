import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { ProviderAvatar } from '../../components/ProviderAvatar';
import { Colors, useProvider } from '@medicare/shared';
import { Skeleton } from '@medicare/ui';
import type { ProviderDetailScreenProps } from '../../navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


function StarRow({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }, (_, i) => (
        <MaterialCommunityIcons
          key={i}
          name={i < count ? 'star' : 'star-outline'}
          size={size}
          color={'#ffb951'}
        />
      ))}
    </View>
  );
}

export default function ProviderDetailScreen({ navigation, route }: ProviderDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { providerId } = route.params;

  const { data: provider, isLoading } = useProvider(providerId);
  const [selectedLocIdx, setSelectedLocIdx] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;

  if (isLoading || !provider) {
    return (
      <View style={styles.root} accessibilityLabel="provider-detail-screen">
        <View style={{ paddingTop: insets.top }} />
        {/* Top Nav */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Provider Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Header Skeleton */}
        <View style={styles.profileInfo}>
          <Skeleton style={{ width: 84, height: 84, borderRadius: 42, marginBottom: 16 }} />
          <Skeleton style={{ width: 180, height: 24, borderRadius: 12, marginBottom: 8 }} />
          <Skeleton style={{ width: 120, height: 16, borderRadius: 8 }} />
        </View>

        {/* Content Skeleton */}
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Skeleton style={{ width: 140, height: 20, borderRadius: 10, marginTop: 16, marginBottom: 16 }} />
          <Skeleton style={{ width: '100%', height: 100, borderRadius: 16, marginBottom: 32 }} />
          
          <Skeleton style={{ width: 160, height: 20, borderRadius: 10, marginBottom: 16 }} />
          <Skeleton style={{ width: '100%', height: 180, borderRadius: 16 }} />
        </ScrollView>
      </View>
    );
  }

  const matchConfidence = Math.round((provider.rating / 5) * 100);

  const handleCall = (phone?: string) => {
    Linking.openURL(`tel:${phone || '18005550199'}`);
  };

  const handleDirections = (lat: number, lng: number, label: string) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${label})`,
    });
    if (url) Linking.openURL(url);
  };

  const extraDetailsOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const extraDetailsHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [44, 0],
    extrapolate: 'clamp',
  });

  const headerPaddingBottom = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [16, 0],
    extrapolate: 'clamp',
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.65],
    extrapolate: 'clamp',
  });

  const locations = provider.locations && provider.locations.length > 0 
    ? provider.locations 
    : [
        {
          name: "Main Office",
          address: provider.address,
          phone: "18005550199",
          coordinate: provider.coordinate
        }
      ];

  const selectedLocation = locations[selectedLocIdx] || locations[0];
  const providerReviews = provider.reviews || [];

  return (
    <View style={styles.root} accessibilityLabel="provider-detail-screen">
      <View style={{ paddingTop: insets.top }} />
      {/* ── Stable Header Area ─────────────────────────────── */}
      <Animated.View style={[styles.stableHeader, { paddingBottom: headerPaddingBottom }]}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Provider Profile</Text>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Animated.View style={[styles.avatarContainer, { transform: [{ scale: avatarScale }] }]}>
            <ProviderAvatar name={provider.name} category={provider.category} photoUrl={provider.photo} size={84} />
            {provider.inNetwork && (
              <View style={styles.networkPill}>
                <MaterialCommunityIcons name="check-decagram" size={10} color={Colors.white} />
                <Text style={styles.networkPillText}>IN-NETWORK</Text>
              </View>
            )}
          </Animated.View>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Animated.View style={{ opacity: extraDetailsOpacity, height: extraDetailsHeight, alignItems: 'center', overflow: 'hidden' }}>
            <Text style={styles.specialtyText}>{provider.specialty}</Text>
            <Text style={styles.networkText}>AmeriHealth Premier Network</Text>
          </Animated.View>
        </View>
      </Animated.View>

      {/* ── Scrollable Insets ─────────────────────────────── */}
      <Animated.ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } 
        )}
        scrollEventThrottle={16}
      >
        {/* About Section */}
        <Text style={styles.sectionHeading}>About {provider.name.split(' ')[0]}</Text>
        <View style={styles.card}>
          <Text style={styles.bioText}>
            {provider.bio ||
              `${provider.name} is a leading expert in their field with 25+ years of clinical excellence. They specialize in holistic, patient-centered care and complex condition management.`}
          </Text>
        </View>

        {/* Smart Match Section */}
        <View style={styles.smartMatchCard}>
          <View style={styles.smartHeader}>
            <View style={styles.smartIconWrap}>
              <MaterialCommunityIcons name="auto-fix" size={18} color={Colors.secondaryContainer} />
            </View>
            <Text style={styles.smartTitle}>Smart Match</Text>
          </View>
          <Text style={styles.smartDesc}>
            Highly rated provider for post-operative care tailored to your recovery plan.
          </Text>
          
          <View style={styles.smartFeatures}>
            {[`Expert in ${provider.specialty}`, 'Accepts your Primary Plan', 'On-site care coordination'].map((item) => (
              <View key={item} style={styles.smartFeatureItem}>
                <MaterialCommunityIcons name="check-circle-outline" size={18} color={Colors.secondaryContainer} />
                <Text style={styles.smartFeatureText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.confidenceBarContainer}>
            <View style={styles.confidenceTrack}>
              <View style={[styles.confidenceFill, { width: `${matchConfidence}%` }]} />
            </View>
            <Text style={styles.confidenceText}>{matchConfidence}% MATCH CONFIDENCE</Text>
          </View>
        </View>

        {/* Office & Locations Section */}
        <Text style={styles.sectionHeading}>Office & Locations</Text>
        
        {/* Location Tabs */}
        {locations.length > 1 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
          >
            {locations.map((loc, idx) => {
              const isSelected = selectedLocIdx === idx;
              return (
                <TouchableOpacity 
                  key={idx} 
                  style={[styles.tabButton, isSelected && styles.tabButtonActive]}
                  onPress={() => setSelectedLocIdx(idx)}
                >
                  <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                    Location {idx + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Selected Location Card */}
        <View style={[styles.card, styles.locationCard]}>
          <Text style={styles.officeName} numberOfLines={1}>{selectedLocation.name}</Text>
          <Text style={styles.officeAddress} numberOfLines={2}>{selectedLocation.address}</Text>
          
          <View style={styles.amenitiesRow}>
            {[
              { icon: 'wheelchair-accessibility', label: 'WHEELCHAIR' },
              { icon: 'parking', label: 'PARKING' },
              { icon: 'office-building', label: '1ST FLOOR' },
            ].map((amenity, i) => (
              <View key={i} style={styles.amenityItem}>
                <View style={styles.amenityIconWrap}>
                  <MaterialCommunityIcons name={amenity.icon as any} size={16} color={Colors.primary} />
                </View>
                <Text style={styles.amenityLabel}>{amenity.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.btnBook}>
              <Text style={styles.btnBookText}>Book</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCall} onPress={() => handleCall(selectedLocation.phone)}>
              <MaterialCommunityIcons name="phone" size={16} color={Colors.primary} />
              <Text style={styles.btnCallText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.btnCall} 
              onPress={() => handleDirections(
                selectedLocation.coordinate.latitude, 
                selectedLocation.coordinate.longitude, 
                selectedLocation.name
              )}
            >
              <MaterialCommunityIcons name="directions" size={16} color={Colors.primary} />
              <Text style={styles.btnCallText}>Directions</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapSnippetWrap}>
            <MapView
              key={`${selectedLocation.coordinate.latitude}-${selectedLocation.coordinate.longitude}`}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: selectedLocation.coordinate.latitude,
                longitude: selectedLocation.coordinate.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker coordinate={selectedLocation.coordinate} pinColor={Colors.primary} />
            </MapView>
          </View>
        </View>

        {/* Patient Reviews */}
        {providerReviews.length > 0 && (
          <>
            <View style={styles.reviewsHeaderRow}>
              <Text style={styles.sectionHeadingNoMargin}>Patient Reviews</Text>
              <View style={styles.ratingSummary}>
                <MaterialCommunityIcons name="star-outline" size={16} color={'#ffb951'} />
                <Text style={styles.ratingSummaryScore}>{provider.rating.toFixed(1)}</Text>
                <Text style={styles.ratingSummaryCount}>({providerReviews.length} reviews)</Text>
              </View>
            </View>

            {providerReviews.slice(0, 3).map((review, idx) => (
              <View key={idx} style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewerName}>{review.name}</Text>
                  <StarRow count={review.stars} size={12} />
                </View>
                <Text style={styles.reviewCardText}>"{review.text}"</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See all reviews</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white }, 
  
  stableHeader: {
    backgroundColor: Colors.white,
    paddingBottom: 16,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  networkPill: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00658d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.white,
    gap: 4,
  },
  networkPillText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
  providerName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00658d',
    marginBottom: 4,
  },
  networkText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },

  scrollArea: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionHeadingNoMargin: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bioText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },

  smartMatchCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    marginHorizontal: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  smartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  smartIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(65,190,253,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  smartDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: 16,
  },
  smartFeatures: {
    gap: 12,
    marginBottom: 20,
  },
  smartFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smartFeatureText: {
    fontSize: 12,
    color: Colors.white,
  },
  confidenceBarContainer: {
    marginTop: 8,
  },
  confidenceTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: 8,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: Colors.secondaryContainer,
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '700',
    letterSpacing: 1,
  },

  // ── Location Tabs
  tabsScrollContent: {
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tabButtonActive: {
    backgroundColor: '#e6f3f8',
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },

  locationCard: {
    // Single card now, don't need width override
    marginBottom: 24,
  },
  officeName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  officeAddress: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginBottom: 16,
    lineHeight: 18,
    height: 36,
  },
  amenitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  amenityItem: {
    alignItems: 'center',
    flex: 1,
  },
  amenityIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6f3f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  amenityLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  btnBook: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnBookText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  btnCall: {
    flex: 1,
    backgroundColor: '#e8eef4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  btnCallText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  mapSnippetWrap: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e6e6e6',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  reviewsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingSummaryScore: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  ratingSummaryCount: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  reviewCardText: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  seeAllBtn: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  seeAllText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

