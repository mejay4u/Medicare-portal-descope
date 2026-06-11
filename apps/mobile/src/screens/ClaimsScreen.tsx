import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, useClaims } from '@medicare/shared';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { ClaimsFilterModal, ClaimsAiConcierge } from '../components/claims';


const getStatusStyles = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PROCESSED':
    case 'COMPLETED':
      return { bg: '#dcfce7', text: '#166534' }; // Green
    case 'IN REVIEW':
    case 'PENDING':
      return { bg: '#dbeafe', text: '#1e40af' }; // Blue
    case 'DENIED':
    case 'REJECTED':
      return { bg: '#fee2e2', text: '#991b1b' }; // Red
    default:
      return { bg: '#f1f5f9', text: '#475569' }; // Gray
  }
};

const getIconStyles = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('dental')) {
    return { icon: 'tooth-outline', bg: '#eff6ff', color: '#2563eb' };
  } else if (t.includes('vision')) {
    return { icon: 'eye-outline', bg: '#fdf4ff', color: '#c026d3' };
  } else if (t.includes('pharmacy') || t.includes('meds')) {
    return { icon: 'pill', bg: '#ccfbf1', color: '#0f766e' };
  } else if (t.includes('medical') || t.includes('outpatient') || t.includes('visit') || t.includes('consult') || t.includes('services') || t.includes('therapy') || t.includes('imaging') || t.includes('study')) {
    return { icon: 'medical-bag', bg: '#dcfce7', color: '#166534' };
  }
  return { icon: 'file-document-outline', bg: '#f1f5f9', color: '#475569' };
};

function ClaimCard({ claim }: { claim: any }) {
  const statusStyle = getStatusStyles(claim.status);
  const iconStyle = getIconStyles(claim.type || 'medical');

  let amountLabel = 'Patient Responsibility';
  let amountValue = claim.memberResponsibility;

  if (claim.status.toUpperCase() === 'IN REVIEW') {
    amountLabel = 'Estimated Benefit';
    amountValue = claim.totalBilled - (claim.planDiscount || 0); 
  } else if (claim.status.toUpperCase() === 'COMPLETED') {
    amountLabel = 'Insurance Paid';
    amountValue = claim.insurancePaid;
  }

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={() => claim.onPress(claim.id)}
    >
      {/* Fixed accent bar on left with status color */}
      <View style={[styles.accentBar, { backgroundColor: statusStyle.text }]} />

      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: iconStyle.bg }]}>
          <MaterialCommunityIcons name={iconStyle.icon as any} size={24} color={iconStyle.color} />
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.statusRow}>
            <Text style={styles.claimId}>CLAIM ID: #{claim.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>
                {claim.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.providerRow}>
            <Text style={styles.providerName} numberOfLines={1}>{claim.provider}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.primary} />
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.footerLabel}>Service Date</Text>
          <Text style={styles.footerValue}>{claim.date}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.footerLabel}>{amountLabel}</Text>
          <Text style={styles.amountValue}>${amountValue?.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

import TopBar from '../components/TopBar';

export default function ClaimsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { data: claims, isLoading, refetch } = useClaims();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const [isFilterVisible, setIsFilterVisible] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<any>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const PAGE_SIZE = 5;

  const displayedClaims = React.useMemo(() => {
    let filtered = claims ? [...claims] : [];
    
    if (activeFilters) {
      filtered = filtered.filter((c: any) => {
        if (activeFilters.selectedStatus && activeFilters.selectedStatus.length > 0) {
          const cs = c.status.toLowerCase();
          let matchesStatus = false;
          if (activeFilters.selectedStatus.includes('processed') && (cs === 'processed' || cs === 'completed')) matchesStatus = true;
          if (activeFilters.selectedStatus.includes('review') && (cs === 'in review' || cs === 'pending')) matchesStatus = true;
          if (activeFilters.selectedStatus.includes('paid') && cs === 'paid') matchesStatus = true;
          if (activeFilters.selectedStatus.includes('denied') && cs === 'denied') matchesStatus = true;
          if (!matchesStatus) return false;
        }

        if (activeFilters.searchQuery && activeFilters.searchQuery.trim().length > 0) {
          if (!c.provider.toLowerCase().includes(activeFilters.searchQuery.toLowerCase())) {
            return false;
          }
        }

        return true;
      });
    }

    // Reset to page 1 when filters change
    return filtered;
  }, [claims, activeFilters]);

  // Effect to reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters]);

  const totalPages = Math.ceil(displayedClaims.length / PAGE_SIZE);
  const paginatedClaims = displayedClaims.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="claims-screen">
      <TopBar />
      <View style={styles.stableHeader}>
        <Text style={styles.navTitle}>Claims</Text>
        <Text style={styles.pageSubtitle}>Your Medical History</Text>
      </View>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        <ClaimsAiConcierge />

        <TouchableOpacity style={styles.filterBtn} onPress={() => setIsFilterVisible(true)}>
          <MaterialCommunityIcons name="tune-vertical" size={18} color={Colors.white} />
          <Text style={styles.filterBtnText}>SMART FILTER</Text>
        </TouchableOpacity>

        {isLoading || !claims ? (
          <View style={{ gap: 16 }}>
             <LoadingSkeleton style={{ height: 160, borderRadius: 16 }} />
             <LoadingSkeleton style={{ height: 160, borderRadius: 16 }} />
          </View>
        ) : displayedClaims.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <MaterialCommunityIcons name="file-search-outline" size={48} color={Colors.borderLight} />
            <Text style={{ marginTop: 16, fontSize: 16, fontWeight: '700', color: Colors.onSurfaceVariant }}>No claims found</Text>
            <Text style={{ marginTop: 8, fontSize: 13, color: Colors.onSurfaceVariant, textAlign: 'center' }}>Try adjusting your filters to see more results.</Text>
          </View>
        ) : (
          <View style={styles.claimsList}>
            {paginatedClaims.map((claim: any) => (
              <ClaimCard
                key={claim.id}
                claim={{...claim, onPress: (id: string) => navigation.navigate('ClaimDetail', { claimId: id })}}
              />
            ))}
          </View>
        )}

        {totalPages > 1 && (
          <View style={styles.pagination}>
            <TouchableOpacity 
              style={[styles.pageBtn, currentPage === 1 && { opacity: 0.5 }]}
              onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <MaterialCommunityIcons name="chevron-left" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              const isActive = p === currentPage;
              return (
                <TouchableOpacity 
                  key={p}
                  style={[styles.pageBtn, isActive && styles.pageBtnActive]}
                  onPress={() => setCurrentPage(p)}
                >
                  <Text style={isActive ? styles.pageTextActive : styles.pageText}>{p}</Text>
                </TouchableOpacity>
              )
            })}
            
            <TouchableOpacity 
              style={[styles.pageBtn, currentPage === totalPages && { opacity: 0.5 }]}
              onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <ClaimsFilterModal 
        visible={isFilterVisible} 
        onClose={() => setIsFilterVisible(false)} 
        onApply={(filters) => setActiveFilters(filters)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  stableHeader: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  navTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginTop: 2,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 },
  filterBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  filterBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  claimsList: {
    gap: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: Platform.OS === 'ios' ? 'hidden' : 'visible',
    position: 'relative',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  claimId: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 24,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  footerLabel: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
  },
  pageBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnActive: {
    backgroundColor: Colors.primary,
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  pageTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
});
