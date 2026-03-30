/**
 * AuthScreen.js - Ã‰cran de Connexion / Inscription
 * 
 * Premier Ã©cran de l'application Novy.
 * Design : Dark mode avec gradient lavande/magenta, formulaire glassmorphism.
 * 
 * FonctionnalitÃ©s :
 * - Toggle entre mode Connexion et Inscription
 * - Validation basique des champs
 * - Appel Ã  l'API (prÃ©parÃ©, en attente des routes Back-end)
 * 
 * Principe POO : Ã‰tat gÃ©rÃ© de maniÃ¨re encapsulÃ©e via useState.
 * @author Ã‰quipe Novy - Challenge 48H Paris Ynov Campus
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '../constants/theme';
import ApiService from '../services/api';

// ============================================================
//  COMPOSANT PRINCIPAL
// ============================================================
const AuthScreen = ({ navigation }) => {
  // --- Ã‰tat local (encapsulation des donnÃ©es du formulaire) ---
  const [isLogin, setIsLogin] = useState(true);       // Toggle connexion/inscription
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Indicateur de chargement
  const [showPassword, setShowPassword] = useState(false);

  // ============================================================
  //  MÃ‰THODES
  // ============================================================

  /**
   * Valide les champs du formulaire avant envoi
   * @returns {boolean} True si valide
   */
  const validateForm = () => {
    if (!email || !password) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires.');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Email invalide', 'Veuillez entrer une adresse email valide.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Mot de passe trop court', 'Le mot de passe doit contenir au moins 6 caractÃ¨res.');
      return false;
    }
    if (!isLogin && (!firstName || !lastName)) {
      Alert.alert('Champs requis', 'Veuillez entrer votre prÃ©nom et nom.');
      return false;
    }
    return true;
  };

  /**
   * GÃ¨re la soumission du formulaire (connexion ou inscription)
   * TODO : Connecter Ã  ApiService.login() ou ApiService.register() quand routes prÃªtes
   */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        console.log('Tentative de connexion...');
        const response = await ApiService.login(email, password);
        console.log('Réponse Backend (Login):', response);
        // ApiService.setAuthToken(response.token);
      } else {
        console.log('Tentative de création de compte...');
        const response = await ApiService.register({ email, password, firstName, lastName });
        console.log('Réponse Backend (Register):', response);
        // ApiService.setAuthToken(response.token);
      }

      // Si pas d'erreur throw, on navigue vers l'app
      navigation.replace('MainApp');

    } catch (error) {
      Alert.alert(
        'Erreur',
        isLogin
          ? 'Email ou mot de passe incorrect.'
          : 'Impossible de crÃ©er le compte. RÃ©essayez.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  //  RENDU
  // ============================================================
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ---- HEADER / LOGO ---- */}
        <View style={styles.header}>
          {/* Logo dÃ©coratif avec la police Brittany Signature (fallback: cursive) */}
          <Text style={styles.logoDecoration}>Welcome to</Text>
          <Text style={styles.logoTitle}>NOVY</Text>
          <Text style={styles.logoSubtitle}>Ynov Campus â€¢ Paris Nanterre</Text>

          {/* Pastille dÃ©corative */}
          <View style={styles.decorativeBadge}>
            <Text style={styles.decorativeBadgeText}>Le rÃ©seau exclusif de ton Ã©cole</Text>
          </View>
        </View>

        {/* ---- CARTE FORMULAIRE (Glassmorphism) ---- */}
        <View style={styles.card}>

          {/* Toggle Connexion / Inscription */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => setIsLogin(true)}
              accessibilityLabel="Se connecter"
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
                CONNEXION
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => setIsLogin(false)}
              accessibilityLabel="CrÃ©er un compte"
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
                INSCRIPTION
              </Text>
            </TouchableOpacity>
          </View>

          {/* Champs PrÃ©nom / Nom (Inscription uniquement) */}
          {!isLogin && (
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
                <Text style={styles.inputLabel}>PRÃ‰NOM</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Lucas"
                  placeholderTextColor={Colors.textMuted}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>NOM</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Martin"
                  placeholderTextColor={Colors.textMuted}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          {/* Champ Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL YNOV</Text>
            <TextInput
              style={styles.input}
              placeholder="prenom.nom@ynov.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Champ Mot de passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>MOT DE PASSE</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? 'ðŸ™ˆ' : 'ðŸ‘ï¸'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lien "Mot de passe oubliÃ©" */}
          {isLogin && (
            <TouchableOpacity style={styles.forgotLink}>
              <Text style={styles.forgotText}>Mot de passe oubliÃ© ?</Text>
            </TouchableOpacity>
          )}

          {/* Bouton de soumission */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}
            accessibilityLabel={isLogin ? 'Se connecter' : 'CrÃ©er mon compte'}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isLogin ? 'SE CONNECTER' : 'CRÃ‰ER MON COMPTE'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Bouton Switch */}
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchText}>
              {isLogin
                ? 'Pas encore de compte ? '
                : 'DÃ©jÃ  un compte ? '}
              <Text style={styles.switchTextAccent}>
                {isLogin ? 'Rejoindre Novy' : 'Me connecter'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* ---- FOOTER ---- */}
        <Text style={styles.footer}>
          Â© 2026 Novy â€” Paris Ynov Campus Nanterre
        </Text>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + 20,
    paddingBottom: Spacing.xl,
  },

  // --- Header ---
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoDecoration: {
    fontFamily: 'cursive',     // TODO: 'BrittanySignature'
    fontSize: 20,
    color: Colors.magentaPink,
    marginBottom: 4,
  },
  logoTitle: {
    fontFamily: 'sans-serif',  // TODO: 'Montelin'
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 12,
    textTransform: 'uppercase',
    color: Colors.textPrimary,
    // Effet de dÃ©gradÃ© simulÃ© avec une couleur unique (expo ne supporte pas text gradient nativement)
  },
  logoSubtitle: {
    fontFamily: 'sans-serif',
    fontSize: 13,
    color: Colors.softLavender,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  decorativeBadge: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(165, 137, 191, 0.15)',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  decorativeBadgeText: {
    color: Colors.softLavender,
    fontSize: 12,
    letterSpacing: 1,
  },

  // --- Carte formulaire ---
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.medium,
  },

  // --- Tabs ---
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  tabActive: {
    backgroundColor: Colors.softLavender,
    ...Shadows.soft,
  },
  tabText: {
    fontFamily: 'sans-serif',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.darkSlate,
  },

  // --- Inputs ---
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontFamily: 'sans-serif',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.softLavender,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    color: Colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: Spacing.md,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },

  // --- Mot de passe oubliÃ© ---
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
    marginTop: -Spacing.xs,
  },
  forgotText: {
    color: Colors.deepTeal,
    fontSize: 13,
    fontWeight: '600',
  },

  // --- Bouton principal ---
  submitButton: {
    backgroundColor: Colors.softLavender,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
    ...Shadows.medium,
  },
  submitButtonText: {
    color: Colors.darkSlate,
    fontFamily: 'sans-serif',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 2,
  },

  // --- Divider ---
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textMuted,
    marginHorizontal: Spacing.sm,
    fontSize: 13,
  },

  // --- Bouton switch ---
  switchButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  switchText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  switchTextAccent: {
    color: Colors.magentaPink,
    fontWeight: '700',
  },

  // --- Footer ---
  footer: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: Spacing.xl,
    letterSpacing: 0.5,
  },
});

export default AuthScreen;

