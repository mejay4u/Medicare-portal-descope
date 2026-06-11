import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@medicare/shared';
import type { ClaimData } from '@medicare/shared';

interface ClaimMedicalInfoProps {
  claim: ClaimData;
}

export default function ClaimMedicalInfo({ claim }: ClaimMedicalInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(v => !v)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="medical-bag" size={18} color={Colors.onSurfaceVariant} />
          <Text style={styles.headerTitle}>Medical Information</Text>
        </View>
        <MaterialCommunityIcons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={Colors.onSurfaceVariant}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.body}>
          <Text style={styles.overline}>RENDERING PROVIDER</Text>
          <Text style={styles.docName}>{claim.doctor}</Text>
          <Text style={styles.npi}>
            NPI: <Text style={{ fontWeight: '400' }}>{claim.doctorNpi}</Text>
          </Text>
          <View style={styles.locationRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.locationText}>{claim.address}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.overline}>DIAGNOSIS CODES</Text>
          {claim.diagnoses.map((d, i) => (
            <View key={i} style={styles.codeRow}>
              <Text style={styles.codeLabel}>{d.code}</Text>
              <Text style={styles.codeTitle}>{d.title}</Text>
              {d.subtitle ? <Text style={styles.codeSubtitle}>{d.subtitle}</Text> : null}
            </View>
          ))}

          <View style={styles.divider} />

          <Text style={styles.overline}>PROCEDURE CODES</Text>
          {claim.services.map((s, i) => (
            <View key={i} style={styles.codeRow}>
              <Text style={styles.codeLabel}>{s.code}</Text>
              <Text style={styles.codeTitle}>{s.title}</Text>
              {s.subtitle ? <Text style={styles.codeSubtitle}>{s.subtitle}</Text> : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  body: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  overline: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0ea5e9',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  docName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  npi: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: Spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  locationText: {
    flex: 1,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceContainerLow,
    marginVertical: Spacing.md,
  },
  codeRow: {
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: 2,
  },
  codeTitle: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  codeSubtitle: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    marginTop: 1,
  },
});
