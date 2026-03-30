/**
 * ProfileScreen.js - Profil Utilisateur Novy
 * 
 * Affiche les informations complètes du profil :
 * - Avatar, nom, rôle, filière
 * - Bio
 * - Compétences (tags)
 * - Statistiques (followers, posts, projets)
 * - Bouton de modification du profil
 * 
 * Principe POO : Composants ProfileStats, SkillBadge encapsulés.
 * @author Équipe Novy - Challenge 48H Paris Ynov Campus
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { currentUserProfile } from '../data/mockData';

// ============================================================
//  SOUS-COMPOSANT : Statistique du profil
// ============================================================
const StatItem = ({ count, label }) => (
  <View style={styles.statItem}>
    <Text style={styles.statCount}>{count}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ============================================================
//  SOUS-COMPOSANT : Badge de compétence
// ============================================================
const SkillBadge = ({ skill }) => (
  <View style={styles.skillBadge}>
    <Text style={styles.skillText}>{skill}</Text>
  </View>
);

// ============================================================
//  COMPOSANT PRINCIPAL
// ============================================================
const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(currentUserProfile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editNewSkill, setEditNewSkill] = useState('');

  /**
   * Sauvegarde les modifications du profil
   * TODO: Connecter à ApiService.updateProfile(userId, profileData)
   */
  const handleSaveProfile = () => {
    setProfile({ ...profile, bio: editBio });
    setShowEditModal(false);
    // TODO: await ApiService.updateProfile(profile.id, { bio: editBio });
    Alert.alert('Sauvegardé !', 'Ton profil a été mis à jour.');
  };

  /**
   * Ajoute une compétence au profil
   */
  const handleAddSkill = () => {
    if (editNewSkill.trim() && !profile.skills.includes(editNewSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, editNewSkill.trim()] });
      setEditNewSkill('');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ---- HEADER PROFIL ---- */}
        <View style={styles.profileHeader}>
          {/* Fond décoratif */}
          <View style={styles.headerBackground} />

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
            {/* Indicateur "en ligne" */}
            <View style={styles.onlineIndicator} />
          </View>

          {/* Nom et rôle */}
          <Text style={styles.profileName}>
            {profile.firstName} {profile.lastName}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{profile.role}</Text>
          </View>
          <Text style={styles.filiereText}>{profile.filiere}</Text>

          {/* Statistiques */}
          <View style={styles.statsRow}>
            <StatItem count={profile.followers} label="Abonnés" />
            <View style={styles.statDivider} />
            <StatItem count={profile.following} label="Abonnements" />
            <View style={styles.statDivider} />
            <StatItem count={profile.projects} label="Projets" />
          </View>

          {/* Boutons d'action */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowEditModal(true)}
            >
              <Text style={styles.editButtonText}>✏️ Modifier le profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>↗️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ---- BIO ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À PROPOS</Text>
          <View style={styles.bioCard}>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>
        </View>

        {/* ---- COMPÉTENCES ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💻 COMPÉTENCES</Text>
          <View style={styles.skillsContainer}>
            {profile.skills.map((skill, idx) => (
              <SkillBadge key={idx} skill={skill} />
            ))}
          </View>
        </View>

        {/* ---- FILIÈRE & ÉCOLE ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎓 FORMATION</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>École</Text>
              <Text style={styles.infoValue}>Paris Ynov Campus</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Filière</Text>
              <Text style={styles.infoValue}>{profile.filiere}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Niveau</Text>
              <Text style={styles.infoValue}>{profile.role}</Text>
            </View>
          </View>
        </View>

        {/* ---- CHATBOT IA (Bouton d'accès) ---- */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <Text style={styles.aiButtonIcon}>🤖</Text>
            <View style={styles.aiButtonContent}>
              <Text style={styles.aiButtonTitle}>ASSISTANT NOVY IA</Text>
              <Text style={styles.aiButtonSubtitle}>Pose tes questions à l'IA Gemini</Text>
            </View>
            <Text style={styles.aiButtonArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* ---- MODAL ÉDITION PROFIL ---- */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>MODIFIER LE PROFIL</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>BIOGRAPHIE</Text>
            <TextInput
              style={styles.bioInput}
              value={editBio}
              onChangeText={setEditBio}
              multiline
              numberOfLines={4}
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.inputLabel}>AJOUTER UNE COMPÉTENCE</Text>
            <View style={styles.skillInputRow}>
              <TextInput
                style={[styles.skillInput]}
                placeholder="ex: TypeScript"
                placeholderTextColor={Colors.textMuted}
                value={editNewSkill}
                onChangeText={setEditNewSkill}
              />
              <TouchableOpacity style={styles.addSkillBtn} onPress={handleAddSkill}>
                <Text style={styles.addSkillBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.currentSkills}>
              {profile.skills.map((s, i) => <SkillBadge key={i} skill={s} />)}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>SAUVEGARDER</Text>
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

  // --- Header Profil ---
  profileHeader: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.softLavender,
    ...Shadows.medium,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.deepTeal,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  roleBadge: {
    backgroundColor: 'rgba(165, 137, 191, 0.2)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  roleText: {
    color: Colors.softLavender,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  filiereText: {
    color: Colors.textMuted,
    fontSize: 13,
    marginBottom: Spacing.lg,
  },

  // --- Stats ---
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statCount: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },

  // --- Action Row ---
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  editButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  shareButtonText: {
    fontSize: 18,
  },

  // --- Sections ---
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  bioCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bioText: {
    color: Colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
  },

  // --- Skills ---
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  skillBadge: {
    backgroundColor: 'rgba(52, 155, 158, 0.2)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.deepTeal,
  },
  skillText: {
    color: Colors.deepTeal,
    fontSize: 13,
    fontWeight: '600',
  },

  // --- Info Card ---
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  infoValue: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },

  // --- Bouton IA ---
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.magentaPink,
    ...Shadows.soft,
  },
  aiButtonIcon: { fontSize: 28, marginRight: Spacing.sm },
  aiButtonContent: { flex: 1 },
  aiButtonTitle: {
    color: Colors.magentaPink,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  aiButtonSubtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  aiButtonArrow: {
    color: Colors.magentaPink,
    fontSize: 28,
    fontWeight: '300',
  },

  // --- Modal ---
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
    marginBottom: Spacing.lg,
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
  },
  inputLabel: {
    color: Colors.softLavender,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  bioInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skillInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  skillInput: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addSkillBtn: {
    backgroundColor: Colors.softLavender,
    borderRadius: BorderRadius.md,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSkillBtnText: {
    color: Colors.darkSlate,
    fontSize: 22,
    fontWeight: '300',
  },
  currentSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  saveButton: {
    backgroundColor: Colors.softLavender,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadows.soft,
  },
  saveButtonText: {
    color: Colors.darkSlate,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 2,
  },
});

export default ProfileScreen;
