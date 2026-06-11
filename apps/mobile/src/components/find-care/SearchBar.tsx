import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@medicare/shared';

type Props = {
  query: string;
  setQuery: (q: string) => void;
  toggleMinimize: (min: boolean) => void;
  isSearchMinimized: boolean;
};

export default function SearchBar({ query, setQuery, toggleMinimize, isSearchMinimized }: Props) {
  return (
    <View style={[styles.searchBar, isSearchMinimized && { marginBottom: 0 }]}>
      <MaterialCommunityIcons name="auto-fix" size={18} color="rgba(255,255,255,0.55)" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="I need a doctor..."
        placeholderTextColor="rgba(255,255,255,0.45)"
        value={query}
        onChangeText={setQuery}
        onFocus={() => toggleMinimize(false)}
        returnKeyType="search"
        selectionColor="rgba(255,255,255,0.7)"
      />
      <TouchableOpacity style={styles.askAiBtn} activeOpacity={0.85}>
        <Text style={styles.askAiText}>Ask AI</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    height: 52,
    marginBottom: 12,
  },
  searchIcon: { marginHorizontal: 12 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
    paddingVertical: 0,
  },
  askAiBtn: {
    backgroundColor: Colors.secondaryContainer,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 6,
  },
  askAiText: {
    color: Colors.onSecondaryContainer,
    fontWeight: '700',
    fontSize: 13,
  },
});
