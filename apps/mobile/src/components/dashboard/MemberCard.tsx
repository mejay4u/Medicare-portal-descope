import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows } from '@medicare/shared';
import { useMember } from '@medicare/shared';

const MemberCard: React.FC = () => {
  const { data } = useMember();
  const handleAddToWallet = () => {
    Alert.alert('Apple Wallet', 'Your card has been successfully added to Apple Wallet.');
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.planMemberText}>{data?.cardLabel || 'PLAN MEMBER'}</Text>
          <Text style={styles.memberName}>{data?.name || 'Eleanor Vance'}</Text>
        </View>
        <MaterialCommunityIcons name="nfc" size={28} color="rgba(255,255,255,0.4)" style={styles.nfcIcon} />
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>MEMBER ID</Text>
          <Text style={styles.detailValue}>{data?.memberId || '8823-1192-004'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>PLAN CODE</Text>
          <Text style={styles.detailValue}>{data?.group || 'MA+ Gold'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.showBackButton} activeOpacity={0.8}>
        <MaterialCommunityIcons name="eye-outline" size={16} color={Colors.white} style={styles.showBackIcon} />
        <Text style={styles.showBackText}>Show Back of Card</Text>
      </TouchableOpacity>

      <View style={styles.actionButtonsRow}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <MaterialCommunityIcons name="email-outline" size={16} color={Colors.white} style={styles.actionIcon} />
          <Text style={styles.actionText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <MaterialCommunityIcons name="truck-outline" size={16} color={Colors.white} style={styles.actionIcon} />
          <Text style={styles.actionText}>Physical</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.walletButton]} activeOpacity={0.8} onPress={handleAddToWallet}>
          <MaterialCommunityIcons name="apple" size={16} color={Colors.white} style={styles.actionIcon} />
          <Text style={styles.actionText}>Add to Wallet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    ...Shadows.light,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  planMemberText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  memberName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  nfcIcon: {
    transform: [{ rotate: '90deg' }],
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 6,
    overflow: 'hidden',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.white,
  },
  showBackButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  showBackIcon: {
    marginRight: 8,
  },
  showBackText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionIcon: {
    marginBottom: 6,
  },
  actionText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '500',
  },
  walletButton: {
    backgroundColor: '#000000',
    flex: 1.5,
    borderColor: '#333',
    borderWidth: 1,
  },
});

export default MemberCard;
