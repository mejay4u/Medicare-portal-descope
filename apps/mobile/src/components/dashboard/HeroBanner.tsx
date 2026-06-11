import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows, FontSize } from '@medicare/shared';
import { useHero } from '@medicare/shared';

const HeroBanner: React.FC = () => {
  const { data } = useHero();

  return (
    <TouchableOpacity activeOpacity={0.85}>
      <LinearGradient
        colors={[Colors.navyDark, Colors.navyLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop' }}
              style={styles.avatar}
            />
            <View style={styles.onlineBadge} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.heading}>{data?.heading || 'CariBear is ready to help.'}</Text>
            <Text style={styles.subtext}>{data?.subtext || 'CariBear is your dedicated AI health companion.'}</Text>
          </View>
          <MaterialCommunityIcons name="swap-vertical" size={24} color={Colors.white} style={styles.icon} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    ...Shadows.light,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.green,
    borderWidth: 2,
    borderColor: Colors.navyDark,
  },
  textContainer: {
    flex: 1,
  },
  heading: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  subtext: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  icon: {
    opacity: 0.8,
  },
});

export default HeroBanner;
