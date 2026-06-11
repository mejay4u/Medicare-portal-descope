import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@medicare/shared';

export type FilterState = {
  category: string;
  inNetwork?: boolean;
  language?: string;
  minRating?: number;
  maxDistance?: number;
};

interface SmartFiltersModalProps {
  visible: boolean;
  initialFilters: FilterState;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

const CATEGORIES = [
  { id: 'All',              label: 'All Specialties',    icon: 'medical-bag' },
  { id: 'Family Medicine',  label: 'Family Medicine',    icon: 'stethoscope' },
  { id: 'Cardiology',       label: 'Cardiology',         icon: 'heart-pulse' },
  { id: 'Pediatrics',       label: 'Pediatrics',         icon: 'baby-face-outline' },
  { id: 'Internal Medicine',label: 'Internal Medicine',  icon: 'pill' },
  { id: 'OBGYN',            label: 'OBGYN',              icon: 'gender-female' },
];

const LANGUAGES = ['English', 'Spanish', 'Mandarin'];

export function SmartFiltersModal({
  visible,
  initialFilters,
  onClose,
  onApply,
}: SmartFiltersModalProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    if (visible) setFilters(initialFilters);
  }, [visible, initialFilters]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAll = () => setFilters({ category: 'All' });

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.root}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.8}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.primary} />
            <Text style={styles.headerTitle}>Find Care</Text>
          </TouchableOpacity>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={16} color={Colors.white} />
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Title */}
          <View style={styles.titleArea}>
            <Text style={styles.mainTitle}>Smart Filters</Text>
            <Text style={styles.subtitle}>Tailor your search for the perfect care partner.</Text>
          </View>

          {/* Specialty */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Specialty</Text>
              {filters.category !== 'All' && (
                <TouchableOpacity onPress={() => updateFilter('category', 'All')}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.cardGroup}>
              {CATEGORIES.filter(c => c.id !== 'All').map((cat, idx, arr) => {
                const isSelected = filters.category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.radioItem, idx === arr.length - 1 && styles.noBorder]}
                    onPress={() => updateFilter('category', isSelected ? 'All' : cat.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.radioIconWrap}>
                      <MaterialCommunityIcons name={cat.icon as any} size={18} color={Colors.primary} />
                    </View>
                    <Text style={styles.radioLabel}>{cat.label}</Text>
                    <MaterialCommunityIcons
                      name={isSelected ? 'radiobox-marked' : 'radiobox-blank'}
                      size={24}
                      color={isSelected ? Colors.primary : Colors.outlineVariant}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Network Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Network Status</Text>
            <Text style={styles.sectionSubtitle}>
              Save on costs by choosing providers within your Aura Wellness network.
            </Text>
            <View style={styles.networkCards}>
              {[
                { value: true,  icon: 'shield-check-outline', label: 'In-Network',     sub: 'Highest coverage' },
                { value: false, icon: 'wallet-outline',        label: 'Out-of-Network', sub: 'Standard rates apply' },
              ].map(({ value, icon, label, sub }) => {
                const active = filters.inNetwork === value;
                return (
                  <TouchableOpacity
                    key={label}
                    style={[styles.networkCard, active ? styles.networkCardActive : styles.networkCardInactive]}
                    onPress={() => updateFilter('inNetwork', active ? undefined : value)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name={icon as any} size={20} color={active ? Colors.white : Colors.primary} />
                    <Text style={[styles.networkTitle, active && styles.networkTitleActive]}>{label}</Text>
                    <Text style={[styles.networkSub, active && styles.networkSubActive]}>{sub}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Language */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Language</Text>
            <View style={styles.chipGroup}>
              {LANGUAGES.map((lang) => {
                const isSelected = filters.language === lang;
                return (
                  <TouchableOpacity
                    key={lang}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => updateFilter('language', isSelected ? undefined : lang)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{lang}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Distance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distance</Text>
            <Text style={styles.sectionSubtitle}>Search within a radius from your home address.</Text>
            <View style={styles.chipGroup}>
              {[5, 10, 20, 50].map((dist) => {
                const isSelected = filters.maxDistance === dist;
                return (
                  <TouchableOpacity
                    key={dist}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => updateFilter('maxDistance', isSelected ? undefined : dist)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{dist} miles</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Star Rating */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Star Rating</Text>
            <View style={styles.cardGroup}>
              {[4, 3].map((rating, idx) => {
                const isSelected = filters.minRating === rating;
                return (
                  <TouchableOpacity
                    key={rating}
                    style={[styles.radioItem, idx === 1 && styles.noBorder]}
                    onPress={() => updateFilter('minRating', isSelected ? undefined : rating)}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name={isSelected ? 'radiobox-marked' : 'radiobox-blank'}
                      size={24}
                      color={isSelected ? Colors.primary : Colors.outlineVariant}
                    />
                    <Text style={styles.radioLabel}>{rating}+ Stars</Text>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <MaterialCommunityIcons
                          key={star}
                          name={star <= rating ? 'star' : 'star-outline'}
                          size={14}
                          color={Colors.tertiary}
                        />
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
            <Text style={styles.clearBtnText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={() => onApply(filters)}>
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: Colors.white,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  titleArea: { marginBottom: 32 },
  mainTitle: { fontSize: 28, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 20 },

  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  sectionSubtitle: { fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 18, marginBottom: 16 },
  clearText: { fontSize: 13, color: Colors.secondary, fontWeight: '600', marginBottom: 8 },

  cardGroup: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  noBorder: { borderBottomWidth: 0 },
  radioIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioLabel: { flex: 1, fontSize: 14, color: Colors.onSurface, fontWeight: '500' },
  starsRow: { flexDirection: 'row', gap: 2 },

  networkCards: { gap: 12 },
  networkCard: { padding: 20, borderRadius: 16, gap: 8 },
  networkCardInactive: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  networkCardActive: { backgroundColor: Colors.primary },
  networkTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  networkTitleActive: { color: Colors.white },
  networkSub: { fontSize: 12, color: Colors.onSurfaceVariant },
  networkSubActive: { color: 'rgba(255,255,255,0.7)' },

  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  chipActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 2,
    paddingHorizontal: 19,
    paddingVertical: 11,
  },
  chipText: { fontSize: 14, color: Colors.onSurfaceVariant, fontWeight: '500' },
  chipTextActive: { color: Colors.primary, fontWeight: '700' },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    gap: 16,
  },
  clearBtn: { paddingVertical: 16, paddingHorizontal: 16 },
  clearBtnText: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  applyBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
