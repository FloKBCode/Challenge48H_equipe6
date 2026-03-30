/**
 * theme.js - Design System Global de l'application Novy
 * 
 * Ce fichier centralise TOUTES les constantes de design (couleurs, polices, espacements).
 * Principe POO : Ce fichier agit comme un "singleton" de configuration.
 * Avantage : Un seul endroit pour modifier le look de toute l'app (maintenabilité).
 * 
 * @author Équipe Novy - Challenge 48H Paris Ynov Campus
 */

// ============================================================
//  PALETTE DE COULEURS - Charte Graphique Novy
// ============================================================
export const Colors = {
  // --- Palette Principale ---
  darkSlate: '#2A2D30',       // Fond principal, éléments sombres
  softLavender: '#A589BF',    // Couleur d'accent principale, boutons, highlights

  // --- Palette Secondaire ---
  duskyRose: '#EFD9E6',       // Fonds de cartes, zones douces
  sageGreen: '#7D8D8B',       // Textes secondaires, icônes inactives
  softMint: '#C2E1D5',        // Tags, badges, éléments de succès

  // --- Accents ---
  magentaPink: '#E395C8',     // Notifications, CTA importants, gradient
  deepTeal: '#349B9E',        // Liens, badges spéciaux, succès

  // --- Utilitaires ---
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // --- Fonds & Surfaces ---
  background: '#1E2124',      // Fond app (plus sombre que darkSlate pour contraste)
  surface: '#2A2D30',         // Cartes, modales
  surfaceLight: '#363A3E',    // Éléments interactifs, inputs

  // --- Textes ---
  textPrimary: '#F0EDF4',     // Texte principal (blanc cassé sur fond sombre)
  textSecondary: '#A589BF',   // Texte secondaire (lavande)
  textMuted: '#7D8D8B',       // Texte désactivé/gris

  // --- Bords ---
  border: '#363A3E',
  borderLight: 'rgba(165, 137, 191, 0.3)',  // Bordure lavande transparente

  // --- Gradients (utilisés avec LinearGradient) ---
  gradientPrimary: ['#A589BF', '#E395C8'],  // Lavande → Magenta
  gradientDark: ['#1E2124', '#2A2D30'],     // Fond sombre
  gradientCard: ['#2A2D30', '#363A3E'],     // Carte

  // --- États ---
  success: '#C2E1D5',
  error: '#E395C8',
  warning: '#EFD9E6',
  info: '#349B9E',
};

// ============================================================
//  TYPOGRAPHIE
// ============================================================
/**
 * IMPORTANT : Les polices personnalisées (Montelin, Mansalva, Brittany Signature)
 * doivent être placées dans assets/fonts/ au format .ttf
 * En attendant, des polices système sont utilisées comme fallback.
 * 
 * Pour activer les polices custom : remplacer 'sans-serif' par le nom exact
 * de la police après l'avoir chargée avec expo-font dans App.js.
 */
export const Fonts = {
  // Titres en MAJUSCULES - Polices à charger : 'Montelin'
  titleLarge: {
    fontFamily: 'sans-serif',    // TODO: remplacer par 'Montelin' après install
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.textPrimary,
  },
  titleMedium: {
    fontFamily: 'sans-serif',    // TODO: 'Montelin'
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textPrimary,
  },
  titleSmall: {
    fontFamily: 'sans-serif',    // TODO: 'Montelin'
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.textPrimary,
  },

  // Texte informatif - Polices à charger : 'Mansalva'
  bodyLarge: {
    fontFamily: 'sans-serif',    // TODO: 'Mansalva'
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  bodyMedium: {
    fontFamily: 'sans-serif',    // TODO: 'Mansalva'
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  bodySmall: {
    fontFamily: 'sans-serif',    // TODO: 'Mansalva'
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: Colors.textMuted,
  },

  // Éléments décoratifs - Polices à charger : 'BrittanySignature'
  decorative: {
    fontFamily: 'cursive',       // TODO: 'BrittanySignature'
    fontSize: 22,
    fontWeight: '400',
    color: Colors.softLavender,
  },

  // Labels et Boutons
  label: {
    fontFamily: 'sans-serif',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.textPrimary,
  },
  button: {
    fontFamily: 'sans-serif',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
};

// ============================================================
//  ESPACEMENTS (Spacing Scale)
// ============================================================
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ============================================================
//  BORDURES & RAYONS
// ============================================================
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,   // Cercle parfait
};

// ============================================================
//  OMBRES
// ============================================================
export const Shadows = {
  soft: {
    shadowColor: Colors.softLavender,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  medium: {
    shadowColor: Colors.magentaPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  strong: {
    shadowColor: Colors.softLavender,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 16,
  },
};

// ============================================================
//  EXPORT PAR DÉFAUT (objet Theme complet)
// ============================================================
const Theme = {
  Colors,
  Fonts,
  Spacing,
  BorderRadius,
  Shadows,
};

export default Theme;
