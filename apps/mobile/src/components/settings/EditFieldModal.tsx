import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Colors, FontSize, Radius } from '@medicare/shared';

interface Props {
  visible: boolean;
  label: string;
  value: string;
  multiline?: boolean;
  loading?: boolean;
  onSave: (value: string) => void;
  onClose: () => void;
}

export default function EditFieldModal({
  visible,
  label,
  value,
  multiline = false,
  loading = false,
  onSave,
  onClose,
}: Props) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Edit {label}</Text>
          <TextInput
            style={[styles.input, multiline && styles.inputMultiline]}
            value={draft}
            onChangeText={setDraft}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            autoFocus
            placeholderTextColor={Colors.textMuted}
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
              onPress={() => onSave(draft)}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.saveText}>{loading ? 'Saving…' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: 24,
    paddingBottom: 44,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.outlineVariant,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: FontSize.base,
    color: Colors.onSurface,
    backgroundColor: Colors.surfaceContainerLow,
  },
  inputMultiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
  },
  cancelText: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveText: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
});
