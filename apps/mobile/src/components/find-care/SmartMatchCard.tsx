import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@medicare/shared';
import { ProviderAvatar } from '../ProviderAvatar';
import type { ProviderData } from '@medicare/shared';

interface Props {
  provider: ProviderData;
  onPress: () => void;
}

export default function SmartMatchCard({ provider, onPress }: Props) {
  return (
    <View style={styles.smartCard}>
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
            <Text style={styles.smartSpecialtyText} numberOfLines={1}>{provider.address}</Text>
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

      <View style={styles.confidenceRow}>
        <View style={styles.confidenceTrack}>
          <View style={[styles.confidenceFill, { width: `${Math.round(provider.rating / 5 * 100)}%` }]} />
        </View>
        <Text style={styles.confidenceLabel}>{Math.round(provider.rating / 5 * 100)}% Match Confidence</Text>
      </View>

      <TouchableOpacity style={styles.smartViewBtn} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.smartViewBtnText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  smartProviderName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.white,
    flexShrink: 1,
  },
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
  smartSpecialtyText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    flex: 1,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 2 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
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
});
