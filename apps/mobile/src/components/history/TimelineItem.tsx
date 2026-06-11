import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, FontSize, Shadows } from '@medicare/shared';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type TimelineEventType = 'diagnosis' | 'lab' | 'visit' | 'immunization';

interface TimelineItemProps {
  type: TimelineEventType;
  date: string;
  title: string;
  subtitle?: string;
  description?: string;
  notes?: string;
  status?: 'urgent' | 'completed' | 'pending';
  showDownload?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const EVENT_CONFIG: Record<TimelineEventType, { icon: any, color: string, label?: string }> = {
  diagnosis: { icon: 'hospital-box-outline', color: '#1E40AF', label: 'DIAGNOSIS' }, // Deep Blue
  lab: { icon: 'test-tube', color: '#3B82F6', label: 'LAB RESULTS' }, // Primary Blue
  visit: { icon: 'stethoscope', color: '#1D4ED8', label: 'TEST' }, // Royal Blue
  immunization: { icon: 'needle', color: '#60A5FA', label: 'VACCINATION' }, // Soft Blue
};

const TimelineItem: React.FC<TimelineItemProps> = ({
  type,
  title,
  subtitle,
  description,
  notes,
  status,
  showDownload,
  isExpanded = false,
  onToggle,
}) => {
  const config = EVENT_CONFIG[type];
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9}
      onPress={onToggle}
    >
      {/* Fixed accent bar on left */}
      <View style={[
        styles.accentBar, 
        { backgroundColor: config.color, left: 0 }
      ]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
            <MaterialCommunityIcons name={config.icon} size={22} color={config.color} />
          </View>
          <MaterialCommunityIcons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={Colors.primary} 
          />
        </View>

        {config.label && <Text style={[styles.typeLabel, { color: config.color }]}>{config.label}</Text>}
        
        <Text style={styles.title}>{title}</Text>

        {isExpanded && (
          <View style={styles.details}>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            {description && <Text style={styles.description}>{description}</Text>}
            
            {notes && (
              <View style={styles.notesBox}>
                <Text style={styles.notesLabel}>NOTES</Text>
                <Text style={styles.notesText}>"{notes}"</Text>
              </View>
            )}

            {status === 'urgent' && (
              <View style={styles.statusRow}>
                <View style={styles.dotUrgent} />
                <Text style={styles.statusUrgent}>URGENT FOLLOW-UP</Text>
              </View>
            )}

            {status === 'completed' && (
              <View style={styles.statusBadgeCompleted}>
                <MaterialCommunityIcons name="check-circle-outline" size={16} color={Colors.greenText} />
                <Text style={styles.statusTextCompleted}>COMPLETED</Text>
              </View>
            )}

            {showDownload && (
              <TouchableOpacity style={styles.downloadButton} activeOpacity={0.7}>
                <MaterialCommunityIcons name="download-outline" size={18} color={Colors.primary} />
                <Text style={styles.downloadText}>Download Report</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    ...Shadows.deep,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 6, // Slightly thicker for emphasis
    zIndex: 2,
  },
  content: {
    padding: Spacing.md,
  },
  details: {
    marginTop: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: '#334155', // Darker slate-700
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: FontSize.sm,
    color: '#475569', // Darker slate-600
    lineHeight: 20,
    fontWeight: '500',
  },
  notesBox: {
    backgroundColor: '#f1f5f9', // slate-100
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary + '40',
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  notesText: {
    fontSize: FontSize.sm,
    color: '#1e293b', // slate-800
    fontStyle: 'italic',
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 6,
  },
  dotUrgent: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  statusUrgent: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  statusBadgeCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successBg,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginTop: Spacing.md,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusTextCompleted: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.greenText,
    letterSpacing: 0.5,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
    gap: 8,
  },
  downloadText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
});

export default TimelineItem;
