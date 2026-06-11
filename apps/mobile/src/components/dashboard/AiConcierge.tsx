import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows } from '@medicare/shared';
import { useHero, useMember } from '@medicare/shared';
import { useNavigation } from '@react-navigation/native';
import LoadingSkeleton from '../LoadingSkeleton';
import { IconCircle } from '../ui';

const AiConcierge: React.FC = () => {
  const { data, isLoading } = useHero();
  const { data: member } = useMember();
  const navigation = useNavigation();
  const [isMinimized, setIsMinimized] = useState(false);

  const firstName = member?.name?.split(' ')[0] || 'there';
  const greetingText = data?.greeting
    ? `Hi ${firstName}, ${data.greeting}`
    : `Hi ${firstName}, I am CariBear. You haven't set up your PCP yet. Would you like to set one up?`;

  if (isLoading || !data) {
    return <LoadingSkeleton style={{ marginHorizontal: 20, marginBottom: 16, height: 120, borderRadius: 16 }} />;
  }

  if (isMinimized) {
    return (
      <TouchableOpacity 
        style={[styles.container, styles.minimizedContainer]} 
        onPress={() => setIsMinimized(false)}
        activeOpacity={0.9}
      >
        <View style={styles.minimizedContent}>
          <View style={styles.minimizedLeft}>
            <MaterialCommunityIcons name="robot-outline" size={20} color={Colors.white} />
            <Text style={styles.minimizedTitle}>CariBear AI is active</Text>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={20} color="rgba(255,255,255,0.6)" />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.leftGroup}>
            <IconCircle
              icon="robot-outline"
              size={40}
              iconSize={20}
              bg={Colors.secondaryContainer}
              color={Colors.onSecondaryContainer}
            />
            <View style={styles.textGroup}>
              <Text style={styles.title}>{data.heading}</Text>
              <Text style={styles.greeting}>{greetingText}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setIsMinimized(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialCommunityIcons name="chevron-up" size={20} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>

        {/* Tappable input — navigates to chat screen */}
        <TouchableOpacity
          style={styles.inputRow}
          activeOpacity={0.75}
          onPress={() => navigation.navigate('CaribearChat' as any)}
        >
          <MaterialCommunityIcons name="message-outline" size={18} color="rgba(255,255,255,0.5)" />
          <Text style={styles.inputPlaceholder}>Ask CariBear anything…</Text>
          <MaterialCommunityIcons name="send" size={18} color={Colors.secondaryContainer} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    ...Shadows.deep,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  minimizedContainer: {
    padding: 16,
  },
  minimizedContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minimizedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  minimizedTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  textGroup: {
    flex: 1,
    paddingRight: 4,
  },
  title: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
  },
  greeting: {
    color: Colors.blueLight,
    fontSize: 13,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  inputPlaceholder: {
    flex: 1,
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
  },
});

export default AiConcierge;
