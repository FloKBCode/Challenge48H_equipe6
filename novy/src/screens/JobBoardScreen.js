/**
 * JobBoardScreen.js - Job Board "Ymatch" de Novy
 * 
 * Écran de mise en relation étudiants ↔ entreprises.
 * Affiche les offres de stage, alternance et emploi.
 * 
 * Fonctionnalités :
 * - Filtres par type de contrat (Tous, Stage, Alternance, CDI, Freelance)
 * - Carte d'offre avec compétences requises
 * - Bouton de candidature (email)
 * - Badge "Nouvelle offre"
 * 
 * Principe POO : Filtre géré via une méthode dédiée (séparation logique/vue).
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
  Linking,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { jobOffers } from '../data/mockData';

// ============================================================
//  CONSTANTES
// ============================================================
// Catégories de filtres
const FILTERS = ['Tous', 'Stage', 'Alternance', 'CDI', 'Freelance'];

// Couleurs associées aux types de contrat
const JOB_TYPE_COLORS = {
  Stage: Colors.deepTeal,
  Alternance: Colors.softLavender,
  CDI: Colors.softMint,
  Freelance: Colors.magentaPink,
};

// ============================================================
//  SOUS-COMPOSANT : Filtre
// ============================================================
const FilterChip = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.filterChip, active && styles.filterChipActive]}
    onPress={onPress}
  >
    <Text style={[styles.filterText, active && styles.filterTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// ============================================================
//  SOUS-COMPOSANT : Carte d'offre d'emploi
// ============================================================
const JobCard = ({ offer }) => {
  const typeColor = JOB_TYPE_COLORS[offer.type] || Colors.softLavender;

  /**
   * Ouvre le client mail pour candidater
   * @param {string} email - Email de contact
   */
  const handleApply = (email) => {
    Linking.openURL(
      `mailto:${email}?subject=Candidature - ${offer.title}&body=Bonjour,\n\nJe suis étudiant(e) à Paris Ynov Campus et je souhaite candidater à votre offre "${offer.title}".\n\n`
    );
    // TODO: await ApiService.applyToJob(offer.id, currentUser.id);
  };

  return (
    <View style={styles.jobCard}>
      {/* Header de la carte */}
      <View style={styles.jobHeader}>
        <Image source={{ uri: offer.logo }} style={styles.companyLogo} />
        <View style={styles.jobTitleBlock}>
          <View style={styles.jobTitleRow}>
            <Text style={styles.jobTitle} numberOfLines={2}>{offer.title}</Text>
            {offer.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
          </View>
          <Text style={styles.companyName}>{offer.company}</Text>
        </View>
      </View>

      {/* Infos de l'offre */}
      <View style={styles.jobMeta}>
        <View style={[styles.typeBadge, { backgroundColor: `${typeColor}22`, borderColor: typeColor }]}>
          <Text style={[styles.typeText, { color: typeColor }]}>{offer.type}</Text>
        </View>
        <Text style={styles.locationText}>📍 {offer.location}</Text>
        <Text style={styles.durationText}>⏱ {offer.duration}</Text>
      </View>

      {/* Description */}
      <Text style={styles.jobDescription} numberOfLines={2}>
        {offer.description}
      </Text>

      {/* Compétences requises */}
      <View style={styles.skillsRow}>
        {offer.skills.map((skill, idx) => (
          <View key={idx} style={styles.skillChip}>
            <Text style={styles.skillChipText}>{skill}</Text>
          </View>
        ))}
      </View>

      {/* Footer : Salaire + Bouton candidature */}
      <View style={styles.jobFooter}>
        <View>
          <Text style={styles.salaryLabel}>Rémunération</Text>
          <Text style={styles.salaryValue}>{offer.salary}</Text>
        </View>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleApply(offer.contactEmail)}
        >
          <Text style={styles.applyButtonText}>POSTULER →</Text>
        </TouchableOpacity>
      </View>

      {/* Date de publication */}
      <Text style={styles.postedAt}>Publié : {offer.postedAt}</Text>
    </View>
  );
};

// ============================================================
//  COMPOSANT PRINCIPAL
// ============================================================
const JobBoardScreen = () => {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [searchText, setSearchText] = useState('');

  /**
   * Filtre les offres selon le type de contrat sélectionné
   * @returns {Array} Offres filtrées
   */
  const getFilteredOffers = () => {
    if (activeFilter === 'Tous') return jobOffers;
    return jobOffers.filter(offer => offer.type === activeFilter);
  };

  const filteredOffers = getFilteredOffers();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* ---- HEADER ---- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>YMATCH</Text>
          <Text style={styles.headerSubtitle}>Trouve ton prochain défi pro</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{jobOffers.length} offres</Text>
        </View>
      </View>

      {/* ---- FILTRES ---- */}
      <View style={{ height: 65 }}> {/* Augmenté de 60 à 65 pour éviter les coupures */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTERS.map(filter => (
            <FilterChip
              key={filter}
              label={filter}
              active={activeFilter === filter}
              onPress={() => setActiveFilter(filter)}
            />
          ))}
        </ScrollView>
      </View>

      {/* ---- COMPTEUR ---- */}
      <Text style={styles.resultsCount}>
        {filteredOffers.length} résultat{filteredOffers.length > 1 ? 's' : ''}
        {activeFilter !== 'Tous' ? ` pour "${activeFilter}"` : ''}
      </Text>

      {/* ---- LISTE DES OFFRES ---- */}
      <FlatList
        data={filteredOffers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <JobCard offer={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>Aucune offre pour ce filtre</Text>
          </View>
        )}
      />
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
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 4,
    fontFamily: 'sans-serif',
  },
  headerSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: 'rgba(165, 137, 191, 0.2)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  headerBadgeText: {
    color: Colors.softLavender,
    fontSize: 13,
    fontWeight: '700',
  },

  // --- Filtres ---
  filtersContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    height: 50, // Augmenté de 45 à 50 pour laisser respirer le texte
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10, // Augmenté de 8 à 10 pour une meilleure lisibilité
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'center', // Empêche le bouton de s'étirer en hauteur
  },
  filterChipActive: {
    backgroundColor: Colors.softLavender,
    borderColor: Colors.softLavender,
  },
  filterText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.darkSlate,
    fontWeight: '800',
  },

  // --- Compteur ---
  resultsCount: {
    color: Colors.textMuted,
    fontSize: 12,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },

  // --- Liste ---
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },

  // --- Job Card ---
  jobCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.soft,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  companyLogo: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
  },
  jobTitleBlock: { flex: 1 },
  jobTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  jobTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
  },
  newBadge: {
    backgroundColor: Colors.magentaPink,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: Colors.darkSlate,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  companyName: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },

  // --- Méta infos ---
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  typeBadge: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  locationText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  durationText: {
    color: Colors.textMuted,
    fontSize: 12,
  },

  // --- Description ---
  jobDescription: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: Spacing.sm,
  },

  // --- Skills ---
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.md,
  },
  skillChip: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  skillChipText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },

  // --- Footer carte ---
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  salaryLabel: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  salaryValue: {
    color: Colors.deepTeal,
    fontSize: 15,
    fontWeight: '800',
  },
  applyButton: {
    backgroundColor: Colors.softLavender,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadows.soft,
  },
  applyButtonText: {
    color: Colors.darkSlate,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },

  // --- Date pub ---
  postedAt: {
    color: Colors.textMuted,
    fontSize: 11,
  },

  // --- Empty State ---
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  emptyIcon: { fontSize: 40, marginBottom: Spacing.md },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
});

export default JobBoardScreen;
