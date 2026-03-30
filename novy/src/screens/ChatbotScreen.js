/**
 * ChatbotScreen.js - Assistant Novy IA (Google Gemini)
 * 
 * Interface de chat avec l'IA Gemini.
 * Design : Interface de messagerie avec :
 * - Bulles de l'utilisateur à DROITE (lavande)
 * - Bulles de l'IA à GAUCHE (surface sombre)
 * - Indicateur "typing..." animé pendant le chargement
 * - Input de texte en bas avec bouton d'envoi
 * 
 * Architecture : L'appel Gemini transite par le Back-end Node.js.
 * Ce composant gère uniquement l'UI et appelle GeminiService.
 * 
 * Principe POO : GeminiService est instancié en dehors du composant
 * (pattern Singleton) pour conserver l'historique entre les renders.
 * @author Équipe Novy - Challenge 48H Paris Ynov Campus
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';
import GeminiService from '../services/geminiService';
import { currentUserProfile } from '../data/mockData';

// ============================================================
//  SOUS-COMPOSANT : Indicateur "typing..." animé
// ============================================================
const TypingIndicator = () => {
  // Animation des 3 points (bounce)
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    /**
     * Anime chaque point avec un délai décalé pour créer l'effet "vague"
     */
    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -6,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(600),
        ])
      );
    };

    const anim1 = animateDot(dot1, 0);
    const anim2 = animateDot(dot2, 200);
    const anim3 = animateDot(dot3, 400);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  return (
    <View style={styles.typingWrapper}>
      <View style={styles.aiAvatarSmall}>
        <Text style={styles.aiAvatarIcon}>🤖</Text>
      </View>
      <View style={styles.typingBubble}>
        <View style={styles.dotsContainer}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View
              key={i}
              style={[styles.dot, { transform: [{ translateY: dot }] }]}
            />
          ))}
        </View>
        <Text style={styles.typingLabel}>Assistant Novy réfléchit...</Text>
      </View>
    </View>
  );
};

// ============================================================
//  SOUS-COMPOSANT : Bulle de message (IA ou Utilisateur)
// ============================================================
const ChatBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.bubbleWrapper, isUser ? styles.bubbleWrapperUser : styles.bubbleWrapperAi]}>
      {/* Avatar IA */}
      {!isUser && (
        <View style={styles.aiAvatarSmall}>
          <Text style={styles.aiAvatarIcon}>🤖</Text>
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
        <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAi]}>
          {message.content}
        </Text>
        <Text style={[styles.bubbleTime, isUser && styles.bubbleTimeUser]}>
          {message.time}
        </Text>
      </View>
    </View>
  );
};

// ============================================================
//  COMPOSANT PRINCIPAL
// ============================================================
const ChatbotScreen = ({ navigation }) => {
  // Message de bienvenue initial de l'IA
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      content: `Bonjour ${currentUserProfile.firstName} ! 👋\n\nJe suis l'Assistant Novy, propulsé par Google Gemini. Je suis là pour t'aider avec tout ce qui concerne Ynov Campus : formation, projets, stages, événements...\n\nComment puis-je t'aider aujourd'hui ?`,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Indicateur "typing..."
  const flatListRef = useRef(null);

  /**
   * Génère un ID unique pour chaque message
   * @returns {string} ID unique basé sur le timestamp
   */
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Envoie un message à l'IA et attend la réponse
   * Utilise GeminiService qui gère l'appel fetch vers le Back-end
   */
  const handleSend = async () => {
    const userInput = inputText.trim();
    if (!userInput || isLoading) return;

    setInputText('');

    // 1. Ajouter le message de l'utilisateur dans l'UI
    const userMessage = {
      id: generateId(),
      role: 'user',
      content: userInput,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, userMessage]);

    // 2. Afficher l'indicateur "typing..."
    setIsLoading(true);

    try {
      // 3. Appel à GeminiService (via Back-end Node.js)
      const aiReply = await GeminiService.sendMessage(userInput, currentUserProfile);

      // 4. Ajouter la réponse de l'IA
      const aiMessage = {
        id: generateId(),
        role: 'ai',
        content: aiReply,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      // En cas d'erreur (Back-end non disponible), afficher un message d'erreur stylisé
      const errorMessage = {
        id: generateId(),
        role: 'ai',
        content: '⚠️ Désolé, l\'Assistant Novy est momentanément indisponible. Réessaie dans quelques instants.',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll automatique vers le bas quand un nouveau message arrive
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatMessages, isLoading]);

  // Questions rapides suggérées
  const quickQuestions = [
    '📅 Prochains événements campus ?',
    '💼 Comment trouver un stage ?',
    '📚 Ressources B1 Dev Web ?',
    '🤝 Rejoindre un projet ?',
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* ---- HEADER ---- */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarIconLarge}>🤖</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>ASSISTANT NOVY</Text>
            <Text style={styles.headerStatus}>
              {isLoading ? '⏳ En train de réfléchir...' : '🟢 En ligne • Gemini AI'}
            </Text>
          </View>
        </View>

        {/* Bouton reset conversation */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            GeminiService.clearHistory();
            setChatMessages([{
              id: generateId(),
              role: 'ai',
              content: 'Conversation réinitialisée ! Comment puis-je t\'aider ?',
              time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            }]);
          }}
        >
          <Text style={styles.resetIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* ---- MESSAGES ---- */}
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={isLoading ? <TypingIndicator /> : null}
      />

      {/* ---- QUESTIONS RAPIDES (visibles seulement au début) ---- */}
      {chatMessages.length <= 1 && !isLoading && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickQuestionsContainer}
        >
          {quickQuestions.map((q, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.quickQuestion}
              onPress={() => {
                setInputText(q.replace(/^[^\s]+ /, '')); // Retire l'emoji
              }}
            >
              <Text style={styles.quickQuestionText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ---- INPUT ---- */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Pose ta question à l'IA..."
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendButton, (inputText.trim() && !isLoading) && styles.sendButtonActive]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendIcon}>{isLoading ? '⏳' : '➤'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// ============================================================
//  STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.xs,
  },
  backIcon: {
    fontSize: 32,
    color: Colors.softLavender,
    lineHeight: 36,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  aiAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(227, 149, 200, 0.15)',
    borderWidth: 2,
    borderColor: Colors.magentaPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarIconLarge: { fontSize: 22 },
  headerTitle: {
    color: Colors.textPrimary,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  headerStatus: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  resetButton: {
    padding: Spacing.sm,
  },
  resetIcon: { fontSize: 20 },

  // --- Messages ---
  messagesContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  bubbleWrapperUser: {
    justifyContent: 'flex-end',
  },
  bubbleWrapperAi: {
    justifyContent: 'flex-start',
  },
  aiAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(227, 149, 200, 0.15)',
    borderWidth: 1.5,
    borderColor: Colors.magentaPink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  aiAvatarIcon: { fontSize: 16 },
  bubble: {
    maxWidth: '78%',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  bubbleUser: {
    backgroundColor: Colors.softLavender,
    borderBottomRightRadius: 4,
    ...Shadows.soft,
  },
  bubbleAi: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: Colors.darkSlate,
    fontWeight: '500',
  },
  bubbleTextAi: {
    color: Colors.textPrimary,
  },
  bubbleTime: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bubbleTimeUser: {
    color: 'rgba(42, 45, 48, 0.5)',
  },

  // --- Typing Indicator ---
  typingWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  typingBubble: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderBottomLeftRadius: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 20,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.magentaPink,
  },
  typingLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },

  // --- Quick Questions ---
  quickQuestionsContainer: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  quickQuestion: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  quickQuestionText: {
    color: Colors.softLavender,
    fontSize: 13,
    fontWeight: '600',
  },

  // --- Input ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: 14,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.magentaPink,
    ...Shadows.soft,
  },
  sendIcon: {
    fontSize: 16,
    color: Colors.darkSlate,
  },
});

export default ChatbotScreen;
