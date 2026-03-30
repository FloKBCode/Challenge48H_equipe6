/**
 * MessagesScreen.js - Messagerie Privée Novy
 * 
 * Cet écran gère DEUX modes :
 * 1. Liste des conversations (quand conversationId est null)
 * 2. Vue d'une conversation spécifique (bulles de messages)
 * 
 * Caractéristiques :
 * - Bulles de messages différenciées (envoyé/reçu)
 * - Indicateur "en ligne" pour les contacts
 * - Badge de messages non lus
 * - Input de message avec envoi
 * 
 * Principe POO : Deux états encapsulés (liste / conversation active).
 * @author Équipe Novy - Challenge 48H Paris Ynov Campus
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { conversations, messages as initialMessages, users } from '../data/mockData';

// ============================================================
//  SOUS-COMPOSANT : Élément de liste de conversation
// ============================================================
const ConversationItem = ({ conv, onPress }) => (
  <TouchableOpacity style={styles.convItem} onPress={onPress}>
    <View style={styles.avatarWrapper}>
      <Image source={{ uri: conv.participantAvatar }} style={styles.convAvatar} />
      {conv.isOnline && <View style={styles.onlineDot} />}
    </View>
    <View style={styles.convInfo}>
      <View style={styles.convTopRow}>
        <Text style={styles.convName}>{conv.participantName}</Text>
        <Text style={styles.convTime}>{conv.lastMessageTime}</Text>
      </View>
      <Text style={styles.convLastMessage} numberOfLines={1}>
        {conv.lastMessage}
      </Text>
    </View>
    {conv.unreadCount > 0 && (
      <View style={styles.unreadBadge}>
        <Text style={styles.unreadText}>{conv.unreadCount}</Text>
      </View>
    )}
  </TouchableOpacity>
);

// ============================================================
//  SOUS-COMPOSANT : Bulle de message
// ============================================================
const MessageBubble = ({ msg }) => (
  <View style={[styles.bubbleWrapper, msg.isMine ? styles.bubbleWrapperMine : styles.bubbleWrapperOther]}>
    {!msg.isMine && (
      <Image
        source={{ uri: users.find(u => u.id === msg.senderId)?.avatarUrl || 'https://i.pravatar.cc/40' }}
        style={styles.bubbleAvatar}
      />
    )}
    <View style={[styles.bubble, msg.isMine ? styles.bubbleMine : styles.bubbleOther]}>
      <Text style={[styles.bubbleText, msg.isMine ? styles.bubbleTextMine : styles.bubbleTextOther]}>
        {msg.content}
      </Text>
      <Text style={[styles.bubbleTime, msg.isMine && styles.bubbleTimeMine]}>
        {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  </View>
);

// ============================================================
//  COMPOSANT PRINCIPAL
// ============================================================
const MessagesScreen = () => {
  // --- État : conversation active (null = liste des conversations) ---
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  /**
   * Ouvre une conversation spécifique
   * @param {Object} conv - Objet conversation
   */
  const openConversation = (conv) => {
    setActiveConversation(conv);
  };

  /**
   * Envoi d'un message
   * TODO: Connecter à ApiService.sendMessage(conversationId, content)
   */
  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      senderId: 1,         // currentUser.id
      senderName: 'Lucas',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
      isMine: true,
    };

    setMessages([...messages, newMsg]);
    setInputText('');

    // Scroll vers le bas après envoi
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // TODO: await ApiService.sendMessage(activeConversation.id, inputText);
  };

  // ============================================================
  //  VUE : Liste des conversations
  // ============================================================
  if (!activeConversation) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MESSAGES</Text>
          <TouchableOpacity style={styles.newConvButton}>
            <Text style={styles.newConvIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Barre de recherche */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une conversation..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* Liste des conversations */}
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ConversationItem
              conv={item}
              onPress={() => openConversation(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  // ============================================================
  //  VUE : Conversation active (bulles de messages)
  // ============================================================
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header de la conversation */}
      <View style={styles.chatHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setActiveConversation(null)}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: activeConversation.participantAvatar }}
          style={styles.chatHeaderAvatar}
        />
        <View style={styles.chatHeaderInfo}>
          <Text style={styles.chatHeaderName}>{activeConversation.participantName}</Text>
          <Text style={styles.chatHeaderStatus}>
            {activeConversation.isOnline ? '🟢 En ligne' : '⚫ Hors ligne'}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MessageBubble msg={item} />}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input de message */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Text style={styles.attachIcon}>📎</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.messageInput}
          placeholder="Écris un message..."
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendIcon}>➤</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 3,
    fontFamily: 'sans-serif',
  },
  newConvButton: {
    padding: Spacing.sm,
  },
  newConvIcon: { fontSize: 22 },

  // --- Barre de recherche ---
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    color: Colors.textPrimary,
    fontSize: 14,
  },

  // --- Conversation Item ---
  convItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  convAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.deepTeal,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  convInfo: { flex: 1 },
  convTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  convName: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  convTime: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  convLastMessage: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  unreadBadge: {
    backgroundColor: Colors.softLavender,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginLeft: Spacing.sm,
  },
  unreadText: {
    color: Colors.darkSlate,
    fontSize: 11,
    fontWeight: '800',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.lg + 52 + Spacing.md,
  },

  // --- Chat Header ---
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.xs,
  },
  backIcon: {
    fontSize: 32,
    color: Colors.softLavender,
    lineHeight: 36,
  },
  chatHeaderAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: Colors.softLavender,
    marginRight: Spacing.sm,
  },
  chatHeaderInfo: { flex: 1 },
  chatHeaderName: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  chatHeaderStatus: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 1,
  },

  // --- Messages ---
  messagesContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.sm,
  },
  bubbleWrapperMine: {
    justifyContent: 'flex-end',
  },
  bubbleWrapperOther: {
    justifyContent: 'flex-start',
  },
  bubbleAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: Spacing.xs,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  bubbleMine: {
    backgroundColor: Colors.softLavender,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextMine: {
    color: Colors.darkSlate,
    fontWeight: '500',
  },
  bubbleTextOther: {
    color: Colors.textPrimary,
  },
  bubbleTime: {
    fontSize: 10,
    color: Colors.sageGreen,
    marginTop: 3,
    alignSelf: 'flex-end',
  },
  bubbleTimeMine: {
    color: 'rgba(42, 45, 48, 0.6)',
  },

  // --- Input Message ---
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
  attachButton: {
    padding: Spacing.xs,
  },
  attachIcon: { fontSize: 20 },
  messageInput: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.softLavender,
  },
  sendIcon: {
    fontSize: 16,
    color: Colors.darkSlate,
  },
});

export default MessagesScreen;
