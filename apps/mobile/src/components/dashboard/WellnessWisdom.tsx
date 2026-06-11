import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, Shadows } from '@medicare/shared';
import { useWellnessWisdom } from '@medicare/shared';
import { SectionTitle } from '../ui';

export default function WellnessWisdom() {
  const { data } = useWellnessWisdom();

  if (!data) return null;

  return (
    <View style={styles.container}>
      <SectionTitle title="Wellness Wisdom" />

      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: data.imageUrl }} style={styles.image} resizeMode="cover" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{data.badge}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.description}>{data.description}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{data.buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 32,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.card,
    shadowColor: Colors.navyDark,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.navyDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.navyDark,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.navyDark,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
