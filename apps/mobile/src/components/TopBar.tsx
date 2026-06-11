import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, FontSize } from '@medicare/shared';
import type { AppStackParamList } from '../navigation/types';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export default function TopBar({ title, showBack = true, rightElement }: TopBarProps) {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <View style={styles.topBar}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={32} color={Colors.primary} />
          </TouchableOpacity>
        )}
        {!showBack && (
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.headerLogo}
          />
        )}
        <Text style={styles.title}>{title || 'AmeriHealth Caritas'}</Text>
      </View>
      
      <View style={styles.rightSection}>
        {rightElement || (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              accessibilityLabel="Notifications"
              accessibilityRole="button"
              onPress={() => navigation.navigate('Notifications')}
            >
              <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              accessibilityLabel="Settings"
              accessibilityRole="button"
              onPress={() => navigation.navigate('Settings')}
            >
              <MaterialCommunityIcons name="cog-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(25, 28, 29, 0.05)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  backButton: {
    marginRight: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  headerLogo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginRight: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 6,
  },
});
