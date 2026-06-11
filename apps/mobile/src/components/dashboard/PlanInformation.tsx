import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, Radius, Spacing } from '@medicare/shared';
import { usePlan, useMember, useBenefits } from '@medicare/shared';
import LoadingSkeleton from '../LoadingSkeleton';
import { Badge, PrimaryButton } from '../ui';

interface Props {
  onNavigate?: (route: string) => void;
}

const TABS = ['Medical', 'Dental', 'Vision', 'Rx'];

const PlanInformation: React.FC<Props> = ({ onNavigate }) => {
  const { data: planData,    isLoading: isLoadingPlan }     = usePlan();
  const { data: memberData,  isLoading: isLoadingMember }   = useMember();
  const { data: benefitsData, isLoading: isLoadingBenefits } = useBenefits();

  const [activeTab, setActiveTab] = useState('Medical');
  const [tabWidth, setTabWidth]   = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleExpand = () => {
    LayoutAnimation.configureNext({
      duration: 400,
      create: { type: LayoutAnimation.Types.spring, property: LayoutAnimation.Properties.opacity, springDamping: 0.8 },
      update: { type: LayoutAnimation.Types.spring, springDamping: 0.8 },
      delete: { type: LayoutAnimation.Types.spring, property: LayoutAnimation.Properties.opacity, springDamping: 0.8 },
    });
    setIsExpanded(!isExpanded);
  };

  React.useEffect(() => {
    if (tabWidth > 0) {
      const index = TABS.indexOf(activeTab);
      Animated.spring(slideAnim, {
        toValue: index * tabWidth,
        useNativeDriver: true,
        bounciness: 4,
        speed: 12,
      }).start();
    }
  }, [activeTab, tabWidth, slideAnim]);

  if (isLoadingPlan || isLoadingMember || isLoadingBenefits || !planData || !memberData || !benefitsData) {
    return <LoadingSkeleton style={{ marginHorizontal: 20, marginBottom: 16, height: 300, borderRadius: 24 }} />;
  }

  const pcpCopay   = planData.copays?.[0]?.amount || '$0';
  const deductible = benefitsData.costs?.find(c => c.label.toLowerCase().includes('deductible'))   || { spent: 0, total: 2500, label: 'Deductible' };
  const moop       = benefitsData.costs?.find(c => c.label.toLowerCase().includes('out-of-pocket') || c.label.toLowerCase().includes('moop')) || { spent: 0, total: 6000, label: 'MOOP' };

  const fmt = (val: number) => `$${val.toLocaleString()}`;
  const currentBreakdown = benefitsData.breakdown?.find(b => b.title.toLowerCase() === activeTab.toLowerCase());

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Plan Information</Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.headerRow} onPress={toggleExpand} activeOpacity={0.8}>
          <View style={styles.titleContainer}>
            <Text style={styles.planName}>{planData.name}</Text>
            <Text style={styles.groupNumber}>
              {isExpanded ? `Group # ${memberData.group || 'AC-7782190'}` : `Member ID: ${memberData.memberId}`}
            </Text>
          </View>
          <View style={styles.badgeWrap}>
            <Badge label="PLAN ACTIVE" dot dotColor={Colors.green} bg={Colors.successBg} color={Colors.greenText} />
            <MaterialCommunityIcons 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.textSecondary} 
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Animated tab strip */}
            <View style={styles.tabContainer}>
              <Animated.View
                style={[
                  styles.activeTabIndicator,
                  { width: tabWidth > 0 ? tabWidth : '25%', transform: [{ translateX: slideAnim }] },
                ]}
              />
              {TABS.map((tab, index) => (
                <TouchableOpacity
                  key={tab}
                  style={styles.tab}
                  onPress={() => setActiveTab(tab)}
                  onLayout={(e) => { if (index === 0) setTabWidth(e.nativeEvent.layout.width); }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {activeTab === 'Medical' ? (
              <>
                {[
                  { label: 'COMBINED DEDUCTIBLE', data: deductible },
                  { label: 'MOOP (MAX OUT-OF-POCKET)', data: moop },
                ].map(({ label, data }) => (
                  <View key={label} style={styles.progressSection}>
                    <View style={styles.progressRow}>
                      <Text style={styles.progressLabel}>{label}</Text>
                      <Text style={styles.progressValues}>
                        <Text style={styles.progressSpent}>{fmt(data.spent)}</Text> / {fmt(data.total)}
                      </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${Math.min(100, (data.spent / data.total) * 100)}%` as any }]} />
                    </View>
                  </View>
                ))}

                <View style={styles.footerRow}>
                  <View style={styles.footerCol}>
                    <Text style={styles.footerLabel}>MEDICARE ID</Text>
                    <Text style={styles.footerValue}>{memberData.memberId}</Text>
                  </View>
                  <View style={styles.footerCol}>
                    <Text style={styles.footerLabel}>PCP COPAY</Text>
                    <Text style={styles.footerValue}>{pcpCopay}</Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.lineItemsContainer}>
                {(currentBreakdown ? currentBreakdown.lineItems : [{ label: 'Coverage details available in Benefits', value: '' }]).map((item, index) => (
                  <View key={index} style={styles.lineItemRow}>
                    <Text style={styles.lineItemLabel}>{item.label}</Text>
                    {item.value ? <Text style={styles.lineItemValue}>{item.value}</Text> : null}
                  </View>
                ))}
              </View>
            )}

            <PrimaryButton
              label="View All Benefits"
              variant="ghost"
              onPress={() => onNavigate?.('benefits')}
              style={{ marginTop: Spacing.md }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginLeft: 20,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(25, 28, 29, 0.05)',
    ...Shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
    lineHeight: 20,
  },
  groupNumber: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandedContent: {
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 20,
    padding: 4,
    marginBottom: 24,
    position: 'relative',
  },
  activeTabIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    ...Shadows.button,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 16,
    zIndex: 1,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  progressValues: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  progressSpent: {
    color: Colors.primary,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 24,
  },
  footerCol: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  lineItemsContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  lineItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  lineItemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  lineItemValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
});

export default PlanInformation;
