import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@medicare/shared';

export default function PharmacyCard() {
  return (
    <View style={styles.pharmacyCard}>
      <View>
        <View style={styles.pharmacyTagRow}>
          <MaterialCommunityIcons name="store-outline" size={16} color={Colors.secondaryContainer} />
          <Text style={styles.pharmacyTag}>PRIMARY PHARMACY</Text>
        </View>
        <Text style={styles.pharmacyName}>Aura Community Care</Text>
        <Text style={styles.pharmacyAddress}>
          1282 Wellness Way, Suite 400{'\n'}
          Sanctuary Heights, CA 90210
        </Text>
      </View>

      <View style={styles.pharmacyFooter}>
        <View style={styles.pharmacyPhone}>
          <MaterialCommunityIcons name="phone-outline" size={18} color={Colors.secondaryContainer} />
          <Text style={styles.pharmacyPhoneText}>(555) 012-3456</Text>
        </View>
        <TouchableOpacity style={styles.changePharmacyBtn} activeOpacity={0.8}>
          <Text style={styles.changePharmacyText}>Change Pharmacy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pharmacyCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderTopRightRadius: 48,
    padding: 24,
    justifyContent: 'space-between',
    gap: 24,
  },
  pharmacyTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  pharmacyTag: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.secondaryContainer,
  },
  pharmacyName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 6,
  },
  pharmacyAddress: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  pharmacyFooter: { gap: 14 },
  pharmacyPhone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pharmacyPhoneText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
  },
  changePharmacyBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  changePharmacyText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
