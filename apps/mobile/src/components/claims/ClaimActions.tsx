import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@medicare/shared';

export default function ClaimActions() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.7}>
        <MaterialCommunityIcons name="download" size={18} color={Colors.primary} />
        <Text style={styles.downloadBtnText}>Download EOB (PDF)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.messageBtn} activeOpacity={0.8}>
        <MaterialCommunityIcons name="message-outline" size={18} color={Colors.white} />
        <Text style={styles.messageBtnText}>Message Care Guide</Text>
      </TouchableOpacity>

      <View style={styles.helpBox}>
        <MaterialCommunityIcons name="help-circle-outline" size={24} color={Colors.tertiary} />
        <View style={styles.helpContent}>
          <Text style={styles.helpTitle}>Have questions about this bill?</Text>
          <Text style={styles.helpDesc}>
            Our dedicated senior advocates are available 24/7 to walk through these charges with you.
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.helpLink}>
              Schedule a call for tomorrow{' '}
              <MaterialCommunityIcons name="arrow-right" size={12} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  downloadBtn: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  downloadBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  messageBtn: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  messageBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  helpBox: {
    backgroundColor: Colors.tertiaryFixed,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    gap: 12,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.tertiary,
    marginBottom: 6,
  },
  helpDesc: {
    fontSize: 12,
    color: Colors.tertiary,
    lineHeight: 18,
    marginBottom: 12,
  },
  helpLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.tertiary,
    textDecorationLine: 'underline',
  },
});
