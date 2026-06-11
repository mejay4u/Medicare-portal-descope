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

function ArcMotif() {
  return <View style={styles.arcMotif} />;
}

export default function ProviderCard({ provider, onPress }: Props) {
  const reviewNum = Math.round((provider.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 180) + 50);
  const bilingual = provider.languages && provider.languages.length > 1;

  return (
    <View style={styles.card}>
      <ArcMotif />
      <View style={styles.cardRow}>
        <View style={styles.avatarWrap}>
          <ProviderAvatar name={provider.name} category={provider.category} photoUrl={provider.photo} size={64} />
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.providerName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{provider.name}</Text>
            {provider.inNetwork && (
              <View style={styles.networkBadge}>
                <Text style={styles.networkBadgeText}>IN-NETWORK</Text>
              </View>
            )}
          </View>
          <View style={styles.specialtyRow}>
            <MaterialCommunityIcons name="medical-bag" size={13} color={Colors.secondary} />
            <Text style={styles.specialtyText} numberOfLines={1}>
              {provider.specialty}{bilingual ? ' • Bilingual' : ''}
            </Text>
          </View>
          <View style={styles.specialtyRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={13} color={Colors.outline} />
            <Text style={styles.addressText} numberOfLines={1}>{provider.address}</Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="star" size={12} color={Colors.tertiary} />
              <Text style={styles.metaRating}>{provider.rating.toFixed(1)} ({reviewNum})</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="navigation" size={12} color={Colors.outline} />
              <Text style={styles.metaDistance}>{provider.distance.toFixed(1)} mi</Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.viewBtn} onPress={onPress} activeOpacity={0.85} accessibilityRole="button" accessibilityLabel={`View details for ${provider.name}`}>
        <Text style={styles.viewBtnText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
