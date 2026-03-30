/**
 * FeedScreen.js - Fil d'Actualité du Réseau Social Novy
 * 
 * Écran principal de l'application. Affiche :
 * - Un encart "News Ynov Campus" (actualités importantes)
 * - Le fil d'actualité des publications des membres
 * - Bouton de création de post
 * 
 * Principe POO : Chaque composant (PostCard, NewsCard) est une entité encapsulée.
 * @author Équipe Novy - Challenge 48H Paris Ynov Campus
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { feedPosts, ynovNews, currentUserProfile } from '../data/mockData';

// ============================================================
//  SOUS-COMPOSANT : Carte d'une News Ynov
// ============================================================
const NewsCard = ({ news }) => (
  <TouchableOpacity style={[styles.newsCard, news.isImportant && styles.newsCardImportant]}>
    <View style={styles.newsBadge}>
      <Text style={styles.newsBadgeText}>{news.category.toUpperCase()}</Text>
    </View>
    <Text style={styles.newsTitle}>{news.title}</Text>
    <Text style={styles.newsContent} numberOfLines={3}>{news.content}</Text>
    <Text style={styles.newsDate}>{news.date}</Text>
  </TouchableOpacity>
);

// ============================================================
//  SOUS-COMPOSANT : Carte d'une Publication (Post)
// ============================================================
const PostCard = ({ post, onLike }) => {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike && onLike(post.id);
  };

  return (
    <View style={styles.postCard}>
      {/* Auteur */}
      <View style={styles.postHeader}>
        <Image source={{ uri: post.authorAvatar }} style={styles.postAvatar} />
        <View style={styles.postAuthorInfo}>
          <Text style={styles.postAuthorName}>{post.authorName}</Text>
          <Text style={styles.postAuthorRole}>{post.authorRole}</Text>
        </View>
        <Text style={styles.postTime}>{post.timeAgo}</Text>
      </View>

      {/* Contenu */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {post.tags.map((tag, idx) => (
          <View key={idx} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>

      {/* Actions Like / Commentaire */}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Text style={[styles.actionIcon, liked && styles.actionIconLiked]}>
            {liked ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.actionCount, liked && styles.actionCountLiked]}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>↗️</Text>
          <Text style={styles.actionCount}>Partager</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ============================================================
//  COMPOSANT PRINCIPAL
// ============================================================
const FeedScreen = () => {
  const [posts, setPosts] = useState(feedPosts);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Gère le "like" d'une publication
   * TODO: Connecter à ApiService.likePost(postId) quand route prête
   */
  const handleLike = (postId) => {
    console.log(`[FeedScreen] Like on post ${postId}`);
    // TODO: await ApiService.post(`/feed/${postId}/like`, {});
  };

  /**
   * Simule le rafraîchissement du fil
   * TODO: Connecter à ApiService.getFeed()
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(res => setTimeout(res, 1000));
    setRefreshing(false);
  };

  /**
   * Publie un nouveau post
   * TODO: Connecter à ApiService.createPost()
   */
  const handlePublish = () => {
    if (!newPostContent.trim()) {
      Alert.alert('Contenu vide', 'Écrivez quelque chose avant de publier.');
      return;
    }

    const newPost = {
      id: posts.length + 1,
      authorId: currentUserProfile.id,
      authorName: `${currentUserProfile.firstName} ${currentUserProfile.lastName}`,
      authorRole: `${currentUserProfile.role} - ${currentUserProfile.filiere}`,
      authorAvatar: currentUserProfile.avatarUrl,
      content: newPostContent,
      timeAgo: 'À l\'instant',
      likes: 0,
      comments: 0,
      isLiked: false,
      tags: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowNewPostModal(false);
  };

  // En-tête du FlatList (News Ynov + champ de nouveau post)
  const ListHeader = () => (
    <>
      {/* ---- BARRE SUPÉRIEURE ---- */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>NOVY</Text>
        <TouchableOpacity style={styles.notifButton}>
          <Text style={styles.notifIcon}>🔔</Text>
          <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>3</Text></View>
        </TouchableOpacity>
      </View>

      {/* ---- ENCART NEWS YNOV ---- */}
      <View style={styles.newsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📢 NEWS YNOV</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Tout voir</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.newsScroll}
        >
          {ynovNews.map(news => (
            <NewsCard key={news.id} news={news} />
          ))}
        </ScrollView>
      </View>

      {/* ---- CRÉER UN POST ---- */}
      <TouchableOpacity
        style={styles.newPostBox}
        onPress={() => setShowNewPostModal(true)}
      >
        <Image source={{ uri: currentUserProfile.avatarUrl }} style={styles.newPostAvatar} />
        <Text style={styles.newPostPlaceholder}>Partage une actualité, un projet...</Text>
        <View style={styles.newPostButton}>
          <Text style={styles.newPostButtonText}>+</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.feedDivider}>
        <Text style={styles.feedDividerText}>Fil d'actualité</Text>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Liste des posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} onLike={handleLike} />}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Modal Nouveau Post */}
      <Modal
        visible={showNewPostModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewPostModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>NOUVEAU POST</Text>
              <TouchableOpacity onPress={() => setShowNewPostModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Quoi de neuf sur le campus ? Partage un projet, une réflexion..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={6}
              value={newPostContent}
              onChangeText={setNewPostContent}
              autoFocus
            />
            <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
              <Text style={styles.publishButtonText}>PUBLIER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  listContent: {
    paddingBottom: Spacing.xxl,
  },

  // --- Top Bar ---
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  appName: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 6,
    color: Colors.textPrimary,
    fontFamily: 'sans-serif',
  },
  notifButton: {
    padding: Spacing.sm,
    position: 'relative',
  },
  notifIcon: { fontSize: 22 },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.magentaPink,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
  },

  // --- News Section ---
  newsSection: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.textPrimary,
    fontFamily: 'sans-serif',
  },
  seeAllText: {
    color: Colors.softLavender,
    fontSize: 13,
    fontWeight: '600',
  },
  newsScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  newsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    width: 250, // Élargi de 200 à 250 pour que le texte rentre
    borderWidth: 1,
    borderColor: Colors.border,
  },
  newsCardImportant: {
    borderColor: Colors.magentaPink,
    borderWidth: 1.5,
  },
  newsBadge: {
    backgroundColor: 'rgba(165, 137, 191, 0.2)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4, // Un peu plus de place en haut/bas
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm, // Un peu plus d'espace en dessous
  },
  newsBadgeText: {
    color: Colors.softLavender,
    fontSize: 9, // Légèrement réduit pour éviter la coupure
    fontWeight: '700',
    letterSpacing: 1,
  },
  newsTitle: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  newsContent: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  newsDate: {
    color: Colors.deepTeal,
    fontSize: 11,
    fontWeight: '600',
  },

  // --- New Post Box ---
  newPostBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  newPostAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: Spacing.sm,
  },
  newPostPlaceholder: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 14,
  },
  newPostButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.softLavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newPostButtonText: {
    color: Colors.darkSlate,
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 28,
  },

  // --- Feed Divider ---
  feedDivider: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  feedDividerText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // --- Post Card ---
  postCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.soft,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.softLavender,
    marginRight: Spacing.sm,
  },
  postAuthorInfo: { flex: 1 },
  postAuthorName: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  postAuthorRole: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  postTime: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  postContent: {
    color: Colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  tag: {
    backgroundColor: 'rgba(165, 137, 191, 0.15)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  tagText: {
    color: Colors.softLavender,
    fontSize: 11,
    fontWeight: '600',
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: { fontSize: 16 },
  actionIconLiked: { },
  actionCount: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  actionCountLiked: {
    color: Colors.magentaPink,
    fontWeight: '700',
  },

  // --- Modal Nouveau Post ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderColor: Colors.borderLight,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 2,
  },
  modalClose: {
    color: Colors.textMuted,
    fontSize: 18,
    padding: 4,
  },
  modalInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  publishButton: {
    backgroundColor: Colors.softLavender,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadows.soft,
  },
  publishButtonText: {
    color: Colors.darkSlate,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 2,
  },
});

export default FeedScreen;
