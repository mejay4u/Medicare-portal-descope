import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@medicare/shared';

export default function PharmacistCard() {
  return (
    <View style={styles.pharmacistCard}>
      <View style={styles.pharmacistIcon}>
        <MaterialCommunityIcons name="chat-question-outline" size={30} color={Colors.white} />
      </View>
      <Text style={styles.pharmacistTitle}>Have a question?</Text>
      <Text style={styles.pharmacistSub}>
        Our pharmacists are available 24/7 for a secure video consultation.
      </Text>
      <TouchableOpacity style={styles.chatBtn} activeOpacity={0.85}>
        <Text style={styles.chatBtnText}>Chat with Pharmacist</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pharmacistCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 14,
    alignItems: 'center',
    gap: 10,
  },
  pharmacistIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pharmacistTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  pharmacistSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
  },
  chatBtn: {
    backgroundColor: Colors.white,
    borderRadius: 99,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginTop: 4,
  },
  chatBtnText: {
    color: Colors.secondary,
    fontWeight: '700',
    fontSize: 14,
  },
});
