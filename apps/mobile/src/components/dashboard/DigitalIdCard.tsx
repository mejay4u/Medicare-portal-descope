import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows } from '@medicare/shared';
import { useMember, usePlan } from '@medicare/shared';
import LoadingSkeleton from '../LoadingSkeleton';
import { SectionTitle } from '../ui';
import flags from '../../config/featureFlags';

const DigitalIdCard: React.FC = () => {
  const { data: memberData, isLoading: memberLoading } = useMember();
  const { data: planData,   isLoading: planLoading }   = usePlan();

  if (memberLoading || planLoading || !memberData || !planData) {
    return (
      <View style={styles.container}>
        <SectionTitle title="Digital ID Card" />
        <LoadingSkeleton style={{ width: '100%', height: 200, borderRadius: 32 }} />
      </View>
    );
  }

  const flipCard = () => {
    Alert.alert('Digital ID Card', 'Card flip functionality is currently disabled.');
  };

  return (
    <View style={styles.container}>
      <SectionTitle title="Digital ID Card" />

      <View style={styles.card}>
        {/* Background watermark simulation */}
        <View style={styles.watermarkContainer}>
          <Text style={styles.watermarkText}>AmeriHealth Caritas{'\n'}New Hampshire</Text>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.logoContainer}>
            <View style={styles.flagIcon}>
              <MaterialCommunityIcons name="flag" size={16} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.logoTextMain}>AmeriHealth Caritas</Text>
              <Text style={styles.logoTextSub}>New Hampshire</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.flipButton} activeOpacity={0.8} onPress={flipCard}>
            <MaterialCommunityIcons name="contactless-payment-circle-outline" size={20} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>MEMBER NAME</Text>
              <Text style={styles.infoValue}>{memberData.name}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>MEMBER ID</Text>
              <Text style={styles.infoValue}>{memberData.memberId}</Text>
            </View>
          </View>
          <View style={styles.infoCol}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>EFFECTIVE DATE</Text>
              <Text style={styles.infoValue}>01/01/2024</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>DATE OF BIRTH</Text>
              <Text style={styles.infoValue}>05/12/1975</Text>
            </View>
          </View>
        </View>

        <View style={styles.stateIdRow}>
          <Text style={styles.infoLabel}>STATE ID</Text>
          <Text style={styles.infoValue}>NH-9988221</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={() => Alert.alert('Apple Wallet', 'Successfully added to Apple Wallet!')}>
          <MaterialCommunityIcons name="wallet-outline" size={24} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Apple Wallet</Text>
        </TouchableOpacity>
        
        {flags.ID_CARD_EMAIL && (
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <MaterialCommunityIcons name="email-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Email Card</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <MaterialCommunityIcons name="card-account-details-outline" size={24} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Order Physical</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(25, 28, 29, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
  watermarkContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.03,
    transform: [{ rotate: '-15deg' }],
  },
  watermarkText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 38,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagIcon: {
    marginTop: 2,
  },
  logoTextMain: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  logoTextSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  flipButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoCol: {
    flex: 1,
    gap: 16,
  },
  infoItem: {},
  infoLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  stateIdRow: {
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(25, 28, 29, 0.05)',
    ...Shadows.light,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
  },
});

export default DigitalIdCard;
