import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, Radius, Spacing, FontSize, useMember } from '@medicare/shared';
import { useNavigation } from '@react-navigation/native';

const ClaimsAiConcierge: React.FC = () => {
  const navigation = useNavigation();
  const { data: member } = useMember();
  const [isMinimized, setIsMinimized] = useState(false);
  const firstName = member?.name?.split(' ')[0] || 'there';

  if (isMinimized) {
    return (
      <TouchableOpacity 
        style={[styles.container, styles.minimizedContainer]} 
        onPress={() => setIsMinimized(false)}
        activeOpacity={0.9}
      >
        <View style={styles.minimizedContent}>
          <View style={styles.aiBadge}>
            <MaterialCommunityIcons name="shimmer" size={14} color={Colors.white} />
            <Text style={styles.aiBadgeText}>CARIBEAR AI INSIGHT AVAILABLE</Text>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={20} color="rgba(255,255,255,0.6)" />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.aiBadge}>
          <MaterialCommunityIcons name="shimmer" size={14} color={Colors.white} />
          <Text style={styles.aiBadgeText}>CARIBEAR AI</Text>
        </View>
        <TouchableOpacity onPress={() => setIsMinimized(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialCommunityIcons name="chevron-up" size={20} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        {firstName}, I noticed one of your claims was rejected.
      </Text>

      <Text style={styles.description}>
        Claim #CLM-2024-0892 for Cardiology services was denied due to missing authorization. Would you like me to help you appeal this or find more information?
      </Text>

      <TouchableOpacity 
        style={styles.ctaButton} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CaribearChat' as any)}
      >
        <Text style={styles.ctaText}>Get Help with Claim</Text>
        <MaterialCommunityIcons name="chat-question-outline" size={18} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00284d',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.deep,
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  minimizedContainer: {
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  minimizedContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    gap: 6,
  },
  aiBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondaryContainer,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.lg,
  },
  ctaText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});

export default ClaimsAiConcierge;
