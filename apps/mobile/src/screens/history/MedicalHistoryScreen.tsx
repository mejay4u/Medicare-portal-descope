import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, StatusBar, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize, Shadows } from '@medicare/shared';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HistoryAiConcierge from '../../components/history/HistoryAiConcierge';
import TimelineItem from '../../components/history/TimelineItem';
import TopBar from '../../components/TopBar';
import { MedicalHistoryScreenProps } from '../../navigation/types';
import HistorySkeleton from '../../components/history/HistorySkeleton';

import { medicalService, MedicalHistoryItem } from '../../services/medical.service';

const FILTERS = ['All', 'Vaccination', 'Test', 'Diagnosis', 'Lab results'];

const MedicalHistoryScreen: React.FC<MedicalHistoryScreenProps> = () => {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('All');
  const [history, setHistory] = useState<MedicalHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsedMonths, setCollapsedMonths] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await medicalService.getMedicalHistory();
        setHistory(data);
        
        // Initialize all months as expanded
        const initialCollapsed: Record<string, boolean> = {};
        data.forEach(item => {
          initialCollapsed[item.monthLabel] = false;
        });
        setCollapsedMonths(initialCollapsed);
      } catch (error) {
        console.error('Failed to fetch medical history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleMonth = (month: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };

  const toggleItem = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isAllExpanded = history.length > 0 && 
    history.every(item => expandedItems[item.id]) && 
    Object.values(collapsedMonths).every(v => !v);

  const toggleAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (isAllExpanded) {
      setExpandedItems({});
      const allCollapsed: Record<string, boolean> = {};
      history.forEach(item => { allCollapsed[item.monthLabel] = true; });
      setCollapsedMonths(allCollapsed);
    } else {
      const allExpanded: Record<string, boolean> = {};
      history.forEach(item => { allExpanded[item.id] = true; });
      setExpandedItems(allExpanded);
      const allMonthsExpanded: Record<string, boolean> = {};
      history.forEach(item => { allMonthsExpanded[item.monthLabel] = false; });
      setCollapsedMonths(allMonthsExpanded);
    }
  };

  const filteredHistory = history.filter(item => 
    activeFilter === 'All' || item.category === activeFilter
  );

  // Group by monthLabel
  const groupedHistory = filteredHistory.reduce((acc, item) => {
    if (!acc[item.monthLabel]) acc[item.monthLabel] = [];
    acc[item.monthLabel].push(item);
    return acc;
  }, {} as Record<string, MedicalHistoryItem[]>);

  const months = Object.keys(groupedHistory).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <View style={styles.root} accessibilityLabel="medical-history-screen">
      <View style={{ paddingTop: insets.top }} />
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <TopBar 
        title="Medical History" 
        rightElement={
          <TouchableOpacity onPress={toggleAll} style={styles.toggleAllBtn}>
            <MaterialCommunityIcons 
              name={isAllExpanded ? "collapse-all" : "expand-all"} 
              size={22} 
              color={Colors.primary} 
            />
          </TouchableOpacity>
        }
      />

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HistoryAiConcierge />

        {/* Filters */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {FILTERS.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Timeline Content */}
        <View style={styles.timelineContainer}>
          <View style={styles.timelineLine} />

          {loading ? (
            <HistorySkeleton />
          ) : months.map(month => {
            const isCollapsed = collapsedMonths[month];
            return (
              <React.Fragment key={month}>
                <TouchableOpacity
                  style={styles.monthMarkerContainer}
                  activeOpacity={0.7}
                  onPress={() => toggleMonth(month)}
                >
                  <View style={styles.monthMarker}>
                    <View style={styles.monthMarkerDot} />
                    <Text style={styles.monthText}>{month}</Text>
                    <MaterialCommunityIcons
                      name={isCollapsed ? "plus-circle-outline" : "minus-circle-outline"}
                      size={16}
                      color={Colors.primary}
                    />
                  </View>
                </TouchableOpacity>

                {!isCollapsed && groupedHistory[month].map(item => (
                  <TimelineItem
                    key={item.id}
                    type={item.type}
                    title={item.title}
                    subtitle={item.subtitle}
                    description={item.description}
                    status={item.status as any}
                    showDownload={item.showDownload}
                    notes={item.notes}
                    date={item.date}
                    isExpanded={expandedItems[item.id]}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
              </React.Fragment>
            );
          })}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  filterContainer: {
    marginBottom: Spacing.lg,
  },
  filterScroll: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainer,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  timelineContainer: {
    position: 'relative',
    paddingTop: Spacing.md,
  },
  timelineLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#cbd5e1', // Darker gray
    zIndex: -1,
  },
  monthMarkerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
    zIndex: 10,
  },
  monthMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)', // Light blue border
    gap: 8,
    ...Shadows.card,
    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
  },
  monthMarkerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  monthText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  toggleAllBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MedicalHistoryScreen;
