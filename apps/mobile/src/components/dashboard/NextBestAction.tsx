import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows } from '@medicare/shared';
import { useActionAlert } from '@medicare/shared';
import LoadingSkeleton from '../LoadingSkeleton';
import { IconCircle } from '../ui';

const NextBestAction: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data, isLoading } = useActionAlert();

  if (isLoading || !data) {
    return <LoadingSkeleton style={{ marginHorizontal: 20, marginBottom: 16, height: 160, borderRadius: 16 }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.headerRow, !isExpanded && styles.headerRowCollapsed]}
          activeOpacity={0.8}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <View style={styles.leftGroup}>
            <IconCircle
              icon="lightbulb-outline"
              size={40}
              iconSize={20}
              bg={Colors.tertiary}
              color={Colors.onTertiaryContainer}
            />
            <View style={styles.textGroup}>
              <Text style={styles.title}>Next Best Action</Text>
              <Text style={styles.subtitle}>Priority Item</Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="rgba(255,255,255,0.7)"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.bodySection}>
            <Text style={styles.bodyTitle}>{data.title}</Text>
            <Text style={styles.bodyDescription}>{data.body}</Text>

            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>Schedule Now</Text>
              <MaterialCommunityIcons name="calendar-today" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.tertiaryContainer,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    ...Shadows.deep,
    shadowColor: Colors.tertiaryContainer,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerRowCollapsed: {
    marginBottom: 0,
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  textGroup: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.onTertiaryContainer,
    fontSize: 11,
  },
  bodySection: {
    marginTop: 4,
  },
  bodyTitle: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  bodyDescription: {
    color: Colors.onTertiaryContainer,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: Colors.tertiary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    ...Shadows.button,
    shadowColor: Colors.onBackground,
    shadowOpacity: 0.15,
  },
  actionButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

export default NextBestAction;
