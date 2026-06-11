import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@medicare/shared';

interface ClaimsFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: { selectedStatus: string[], dateRange: string, searchQuery: string, selectedDep: string }) => void;
}

export default function ClaimsFilterModal({ visible, onClose, onApply }: ClaimsFilterModalProps) {
  const insets = useSafeAreaInsets();

  const [selectedStatus, setSelectedStatus] = useState<string[]>(['processed']);
  const [dateRange, setDateRange] = useState('last30');
  const [selectedDep, setSelectedDep] = useState('john');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleStatus = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleClearAll = () => {
    setSelectedStatus([]);
    setDateRange('last30');
    setSearchQuery('');
    setSelectedDep('john');
  };

  const handleApply = () => {
    onApply({ selectedStatus, dateRange, searchQuery, selectedDep });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.root, { paddingTop: insets.top }]}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Claims Center</Text>
          <View style={styles.avatarMini}>
            <MaterialCommunityIcons name="account" size={14} color={Colors.white} />
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Title Area */}
          <Text style={styles.overline}>REFINE SEARCH</Text>
          <Text style={styles.pageTitle}>Smart Filter</Text>
          <Text style={styles.pageSubtitle}>
            Adjust your preferences to find specific medical claims within your history.
          </Text>

          {/* Claim Status */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Claim Status</Text>
            <Text style={styles.sectionAction}>Select one or more</Text>
          </View>

          <View style={styles.grid2}>
            {[
              { id: 'processed', icon: 'check-circle-outline', label: 'Processed' },
              { id: 'review',    icon: 'eye-outline',          label: 'In Review' },
              { id: 'paid',      icon: 'cash',                 label: 'Paid' },
              { id: 'denied',    icon: 'close-circle-outline', label: 'Denied' },
            ].map(({ id, icon, label }) => {
              const active = selectedStatus.includes(id);
              return (
                <TouchableOpacity
                  key={id}
                  style={[styles.statusBox, active && styles.statusBoxActive]}
                  onPress={() => toggleStatus(id)}
                >
                  {active && <View style={styles.activeDot} />}
                  <MaterialCommunityIcons
                    name={icon as any}
                    size={20}
                    color={active ? Colors.primary : Colors.onSurfaceVariant}
                  />
                  <Text style={[styles.statusBoxText, active && styles.statusBoxTextActive]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Date Range */}
          <View style={styles.cardBg}>
            <Text style={styles.cardTitle}>Date Range</Text>
            <View style={styles.pillRow}>
              {[
                { id: 'last30',   label: 'Last 30 days' },
                { id: '6months',  label: '6 months' },
                { id: 'ytd',      label: 'Year to Date' },
              ].map(({ id, label }) => (
                <TouchableOpacity
                  key={id}
                  style={[styles.pill, dateRange === id && styles.pillActive]}
                  onPress={() => setDateRange(id)}
                >
                  <Text style={[styles.pillText, dateRange === id && styles.pillTextActive]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.datePicker}>
              <MaterialCommunityIcons name="calendar-month-outline" size={18} color={Colors.onSurfaceVariant} />
              <Text style={styles.datePickerText}>Custom Date Picker</Text>
            </View>
          </View>

          {/* Provider Name */}
          <Text style={styles.sectionTitle}>Provider Name</Text>
          <View style={styles.searchInput}>
            <MaterialCommunityIcons name="magnify" size={20} color={Colors.onSurfaceVariant} />
            <TextInput
              placeholder="Search medical facilities or doctors.."
              placeholderTextColor={Colors.onSurfaceVariant}
              style={{ flex: 1, fontSize: 13, color: Colors.onSurface }}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
            {[
              { query: 'City General',    icon: 'hospital-building', label: 'City General' },
              { query: 'Aura Dental Care', icon: 'medical-bag',      label: 'Aura Dental C...' },
            ].map(({ query, icon, label }) => (
              <TouchableOpacity key={query} style={styles.recentChip} onPress={() => setSearchQuery(query)}>
                <View style={styles.recentIconBox}>
                  <MaterialCommunityIcons name={icon as any} size={14} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.recentChipTitle}>{label}</Text>
                  <Text style={styles.recentChipSub}>RECENT</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Subscribers & Dependents */}
          <Text style={styles.sectionTitle}>Subscribers & Dependents</Text>
          <View style={styles.depList}>
            {[
              { id: 'john',  initials: 'JD', name: 'John Doe',   role: 'Primary Subscriber (You)' },
              { id: 'sarah', initials: 'SD', name: 'Sarah Doe',  role: 'Dependent' },
              { id: 'mikey', initials: 'MD', name: 'Mikey Doe',  role: 'Dependent' },
            ].map(({ id, initials, name, role }) => {
              const active = selectedDep === id;
              return (
                <TouchableOpacity
                  key={id}
                  style={[styles.depItem, active && styles.depItemActive]}
                  onPress={() => setSelectedDep(id)}
                >
                  <View style={[styles.depAvatar, active && styles.depAvatarActive]}>
                    <Text style={[styles.depInitials, active && styles.depInitialsActive]}>{initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.depName, active && styles.depNameActive]}>{name}</Text>
                    <Text style={[styles.depRole, active && styles.depRoleActive]}>{role}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name={active ? 'check-circle-outline' : 'circle-outline'}
                    size={20}
                    color={active ? Colors.white : Colors.onSurfaceVariant}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
            <Text style={styles.clearBtnText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  overline: { fontSize: 10, fontWeight: '800', color: Colors.secondary, letterSpacing: 1, marginBottom: 8 },
  pageTitle: { fontSize: 32, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5, marginBottom: 12 },
  pageSubtitle: { fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 18, marginBottom: 32 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginBottom: 12 },
  sectionAction: { fontSize: 11, color: Colors.onSurfaceVariant },

  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  statusBox: {
    width: '48%',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statusBoxActive: { backgroundColor: Colors.white, borderColor: Colors.primary },
  statusBoxText: { fontSize: 14, fontWeight: '700', color: Colors.onSurfaceVariant, marginTop: 12 },
  statusBoxTextActive: { color: Colors.primary },
  activeDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },

  cardBg: { backgroundColor: Colors.surfaceContainerLow, borderRadius: 20, padding: 20, marginBottom: 32 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginBottom: 16 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  pill: { backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  pillActive: { backgroundColor: Colors.primary },
  pillText: { fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant },
  pillTextActive: { color: Colors.white },
  datePicker: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  datePickerText: { fontSize: 13, color: Colors.onSurfaceVariant },

  searchInput: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  recentChip: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  recentIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentChipTitle: { fontSize: 13, fontWeight: '700', color: Colors.onSurface },
  recentChipSub: { fontSize: 9, fontWeight: '800', color: Colors.onSurfaceVariant, letterSpacing: 0.5 },

  depList: { gap: 12 },
  depItem: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  depItemActive: { backgroundColor: Colors.primary },
  depAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depAvatarActive: { backgroundColor: Colors.primaryContainer },
  depInitials: { fontSize: 14, fontWeight: '700', color: Colors.onSurfaceVariant },
  depInitialsActive: { color: Colors.white },
  depName: { fontSize: 15, fontWeight: '700', color: Colors.onSurface, marginBottom: 2 },
  depNameActive: { color: Colors.white },
  depRole: { fontSize: 11, color: Colors.onSurfaceVariant },
  depRoleActive: { color: 'rgba(255,255,255,0.7)' },

  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  clearBtnText: { fontSize: 14, fontWeight: '700', color: Colors.onSurface },
  applyBtn: { flex: 2, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  applyBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
