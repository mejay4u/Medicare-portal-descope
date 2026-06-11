import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows } from '@medicare/shared';
import { useProviders } from '@medicare/shared';
import LoadingSkeleton from '../LoadingSkeleton';
import { SectionTitle } from '../ui';

interface Props {
  onNavigate?: (route: string) => void;
}

const PrimaryCare: React.FC<Props> = ({ onNavigate }) => {
  const { data: providers, isLoading } = useProviders({ category: 'Primary Care' });
  const pcp = providers && providers.length > 0 ? providers[0] : null;

  if (isLoading || !pcp) {
    return (
      <View style={styles.container}>
        <SectionTitle title="Your Care Team" />
        <LoadingSkeleton style={{ width: '100%', height: 200, borderRadius: 32 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionTitle title="Your Care Team" />

      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: pcp.photo }} style={styles.doctorImage} />
            <View style={styles.onlineBadge} />
          </View>

          <View style={styles.doctorDetails}>
            <View style={styles.pcpBadge}>
              <Text style={styles.pcpBadgeText}>Primary Care Provider</Text>
            </View>
            <Text style={styles.doctorName}>{pcp.name}</Text>
            <View style={styles.specialtyRow}>
              <MaterialCommunityIcons name="medical-bag" size={18} color={Colors.blueLight} />
              <Text style={styles.specialty}>{pcp.specialty}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => onNavigate?.('provider-detail')}
          >
            <MaterialCommunityIcons name="eye-outline" size={18} color={Colors.primary} />
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => onNavigate?.('find-care')}
          >
            <MaterialCommunityIcons name="sync" size={18} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Change PCP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.primary,
    borderRadius: 32,
    overflow: 'hidden',
    ...Shadows.elevated,
  },
  cardTop: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  imageContainer: {
    position: 'relative',
    ...Shadows.light,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  doctorImage: {
    width: 96,
    height: 96,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: Colors.surfaceContainerLow,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: Colors.green,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  doctorDetails: {
    flex: 1,
  },
  pcpBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  pcpBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.secondaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 24,
  },
  specialtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  specialty: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.blueLight,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
    backgroundColor: Colors.white,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
    gap: 6,
  },
  actionButtonText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
});

export default PrimaryCare;
