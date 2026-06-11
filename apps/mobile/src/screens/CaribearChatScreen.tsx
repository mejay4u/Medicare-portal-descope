import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSize, Radius, Spacing, Shadows } from '@medicare/shared';
import { useHero, useMember } from '@medicare/shared';

// ── Types ─────────────────────────────────────────────────────────────────────

type MessageRole = 'assistant' | 'user';

interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
}

// ── Conversation phase ────────────────────────────────────────────────────────

type ConversationPhase = 'initial' | 'providers_shown' | 'pcp_assigned' | 'general';

const PROVIDERS = [
  { name: 'Dr. Sarah Chen, MD', clinic: 'City Center Health Pavilion' },
  { name: 'Dr. Marcus Lee, MD', clinic: 'Westside Wellness Clinic' },
  { name: 'Dr. Priya Patel, MD', clinic: 'Riverside Medical Group' },
];

// ── Mock agentic responses ────────────────────────────────────────────────────

function getMockResponse(
  userText: string,
  firstName: string,
  phase: ConversationPhase,
): { text: string; nextPhase: ConversationPhase } {
  const lower = userText.toLowerCase();
  const isAffirmative = /\byes\b|yeah|sure|ok\b|please|set|assign|pick|choose/.test(lower);
  const isNegative = /\bno\b|not now|later|skip|nope/.test(lower);

  // Phase: provider list was shown — "yes" means assign PCP
  if (phase === 'providers_shown') {
    if (isAffirmative) {
      const assigned = PROVIDERS[0];
      return {
        text: `Great choice, ${firstName}! I have assigned ${assigned.name} at ${assigned.clinic} as your Primary Care Provider. You'll receive a confirmation shortly. Is there anything else I can help you with?`,
        nextPhase: 'pcp_assigned',
      };
    }
    if (isNegative) {
      return {
        text: `No problem, ${firstName}. You can set your PCP any time — just ask me. Is there anything else I can help you with?`,
        nextPhase: 'general',
      };
    }
  }

  // PCP / provider search intent
  if (isAffirmative || /pcp|primary|doctor|physician|provider|find/.test(lower)) {
    const list = PROVIDERS.map(p => `• ${p.name} – ${p.clinic}`).join('\n');
    return {
      text: `Sure, ${firstName}! Based on your Member Choice Plus plan, here are 3 in-network primary care providers near you:\n\n${list}\n\nDo you want to set any one of them as your Primary Care Provider?`,
      nextPhase: 'providers_shown',
    };
  }

  if (/benefit|cover|plan|copay|deductible/.test(lower)) {
    return {
      text: `Your Member Choice Plus plan covers primary care visits at a $20 copay. You've used $450 of your $1,500 deductible this year. Annual preventive visits are covered at 100% — no cost to you.`,
      nextPhase: 'general',
    };
  }
  if (/prescription|medication|refill|drug/.test(lower)) {
    return {
      text: `You have 3 active prescriptions: Lisinopril, Metformin, and Atorvastatin. Metformin is due for a refill in 8 days. Would you like me to send the refill request to your pharmacy?`,
      nextPhase: 'general',
    };
  }
  if (/claim|bill|paid|reimburse/.test(lower)) {
    return {
      text: `Your most recent claim (#CLM-2024-0892) was processed on Jan 15 and paid $240. You have 2 claims under review — I can check their status. Would you like me to do that?`,
      nextPhase: 'general',
    };
  }
  if (isNegative) {
    return {
      text: `No problem, ${firstName}. I'm here whenever you need me. Is there anything else I can help you with?`,
      nextPhase: 'general',
    };
  }
  if (/thank|thanks|perfect|awesome/.test(lower)) {
    return {
      text: `You're welcome, ${firstName}! Always happy to help. Is there anything else I can assist you with?`,
      nextPhase: 'general',
    };
  }

  return {
    text: `I understand, ${firstName}. I can help you find providers, check benefits, review claims, or manage prescriptions. What would you like to explore?`,
    nextPhase: 'general',
  };
}

// ── Subcomponents ─────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isAssistant = message.role === 'assistant';
  return (
    <View style={[styles.bubbleWrapper, isAssistant ? styles.bubbleLeft : styles.bubbleRight]}>
      {isAssistant && (
        <View style={styles.avatarDot}>
          <MaterialCommunityIcons name="robot-outline" size={16} color={Colors.white} />
        </View>
      )}
      <View style={[styles.bubble, isAssistant ? styles.bubbleAssistant : styles.bubbleUser]}>
        <Text style={[styles.bubbleText, isAssistant ? styles.bubbleTextAssistant : styles.bubbleTextUser]}>
          {message.text}
        </Text>
        <Text style={[styles.timestamp, isAssistant ? styles.timestampAssistant : styles.timestampUser]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

function TypingIndicator() {
  return (
    <View style={[styles.bubbleWrapper, styles.bubbleLeft]}>
      <View style={styles.avatarDot}>
        <MaterialCommunityIcons name="robot-outline" size={16} color={Colors.white} />
      </View>
      <View style={[styles.bubble, styles.bubbleAssistant, styles.typingBubble]}>
        <ActivityIndicator size="small" color={Colors.blueLight} />
        <Text style={styles.typingText}>CariBear is thinking…</Text>
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function CaribearChatScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { data: hero } = useHero();
  const { data: member } = useMember();
  const firstName = member?.name?.split(' ')[0] || 'there';

  const initialGreeting = hero?.greeting
    ? `Hi ${firstName}, ${hero.greeting}`
    : `Hi ${firstName}, I am CariBear. You haven't set up your PCP yet. Would you like to set one up?`;

  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', text: initialGreeting, timestamp: new Date() },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<ConversationPhase>('initial');
  const listRef = useRef<FlatList>(null);

  // Update greeting once hero/member data loads
  useEffect(() => {
    const greeting = hero?.greeting
      ? `Hi ${firstName}, ${hero.greeting}`
      : `Hi ${firstName}, I am CariBear. You haven't set up your PCP yet. Would you like to set one up?`;
    setMessages([{ id: '0', role: 'assistant', text: greeting, timestamp: new Date() }]);
  }, [hero, firstName]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.canGoBack()) { navigation.goBack(); return true; }
      return false;
    });
    return () => sub.remove();
  }, [navigation]);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, []);

  const sendMessage = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setTimeout(scrollToBottom, 50);

    // Simulate agentic response latency
    setTimeout(() => {
      const { text: replyText, nextPhase } = getMockResponse(text, firstName, phase);
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: replyText,
        timestamp: new Date(),
      };
      setIsTyping(false);
      setPhase(nextPhase);
      setMessages(prev => [...prev, reply]);
      setTimeout(scrollToBottom, 50);
    }, 1400);
  }, [inputText, firstName, phase, scrollToBottom]);

  function handleBack() {
    if (navigation.canGoBack()) navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.navyDark} />

      {/* Header */}
      <LinearGradient
        colors={[Colors.navyDark, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <MaterialCommunityIcons name="robot-outline" size={22} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.headerName}>CariBear</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineLabel}>AI Health Companion · Online</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <MaterialCommunityIcons name="dots-vertical" size={22} color="rgba(255,255,255,0.6)" />
        </View>
      </LinearGradient>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToBottom}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <MessageBubble message={item} />}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        {/* Quick reply chips */}
        {messages.length === 1 && (
          <View style={styles.chipsRow}>
            {['Yes, help me find one', 'Not right now', 'Tell me more'].map(chip => (
              <TouchableOpacity
                key={chip}
                style={styles.chip}
                activeOpacity={0.75}
                onPress={() => { setInputText(chip); }}
              >
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input bar */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            style={styles.textInput}
            placeholder="Message CariBear…"
            placeholderTextColor={Colors.textMuted ?? '#9CA3AF'}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            returnKeyType="default"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            activeOpacity={0.8}
            disabled={!inputText.trim() || isTyping}
          >
            <MaterialCommunityIcons name="send" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.navyDark,
  },
  flex: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  headerName: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSize.md,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.green,
  },
  onlineLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
  },
  headerRight: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Messages
  messageList: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: 12,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  bubbleLeft: {
    justifyContent: 'flex-start',
  },
  bubbleRight: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatarDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...Shadows.light,
    shadowOpacity: 0.08,
  },
  bubbleAssistant: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  bubbleText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  bubbleTextAssistant: {
    color: '#1E293B',
  },
  bubbleTextUser: {
    color: Colors.white,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  timestampAssistant: {
    color: '#94A3B8',
  },
  timestampUser: {
    color: 'rgba(255,255,255,0.6)',
  },
  typingText: {
    color: '#64748B',
    fontSize: 13,
  },
  // Quick reply chips
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.primaryFixed,
    ...Shadows.light,
    shadowOpacity: 0.06,
  },
  chipText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingTop: 10,
    gap: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    backgroundColor: '#F1F5F9',
    borderRadius: 21,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: FontSize.sm,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.light,
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
});
