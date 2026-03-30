/**
 * App.js - Point d'entrée de l'application Novy
 * 
 * Responsabilités :
 * 1. Chargement des polices personnalisées (expo-font)
 * 2. Affichage du splash screen pendant le chargement
 * 3. Rendu du navigateur principal (AppNavigator)
 * 
 * Architecture POO :
 * - App est le composant racine (Root Component)
 * - Il délègue la navigation à AppNavigator (Single Responsibility Principle)
 * - La gestion des polices est centralisée ici pour tout l'app
 * 
 * @author Équipe Novy - Challenge 48H Paris Ynov Campus
 * @version 1.0.0 - MVP Challenge 48H
 */

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { Colors } from './src/constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

// ============================================================
//  COMPOSANT : Splash Screen de chargement
// ============================================================
/**
 * Affiché pendant le chargement des polices
 * Donne une première impression premium de l'app
 */
const SplashScreen = () => (
  <View style={styles.splash}>
    <Text style={styles.splashDecoration}>bienvenue sur</Text>
    <Text style={styles.splashTitle}>NOVY</Text>
    <Text style={styles.splashSubtitle}>PARIS YNOV CAMPUS</Text>
    <ActivityIndicator
      color={Colors.softLavender}
      size="small"
      style={{ marginTop: 40 }}
    />
  </View>
);

// ============================================================
//  COMPOSANT PRINCIPAL : App
// ============================================================
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    /**
     * Charge les polices personnalisées depuis le dossier assets/fonts/
     * 
     * INSTRUCTIONS D'INSTALLATION DES POLICES :
     * 1. Télécharger les fichiers .ttf depuis DaFont ou archives de polices :
     *    - Montelin.ttf      → https://www.dafont.com (chercher "Montelin")
     *    - Mansalva.ttf      → https://fonts.google.com (chercher "Mansalva")
     *    - BrittanySignature.ttf → https://www.dafont.com (chercher "Brittany")
     * 2. Glisser les fichiers dans le dossier : assets/fonts/
     * 3. Décommenter les lignes ci-dessous
     * 4. Remplacer 'sans-serif' par les noms de polices dans src/constants/theme.js
     */
    const loadFonts = async () => {
      try {
        // Décommenter et utiliser Font.loadAsync quand les fichiers sont là
        /* await Font.loadAsync({
          'Montelin':          require('./assets/fonts/Montelin.ttf'),
          'Mansalva':          require('./assets/fonts/Mansalva.ttf'),
          'BrittanySignature': require('./assets/fonts/BrittanySignature.ttf'),
        }); */
      } catch (error) {
        console.warn('[App] Polices custom non chargées. Utilisation du fallback.', error);
      } finally {
        setFontsLoaded(true);
      }
    };

    loadFonts();
  }, []);

  // Afficher le splash pendant le chargement
  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  // Application principale
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

// ============================================================
//  STYLES DU SPLASH SCREEN
// ============================================================
const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashDecoration: {
    fontFamily: 'cursive',         // TODO: 'BrittanySignature'
    fontSize: 20,
    color: Colors.magentaPink,
    marginBottom: 4,
  },
  splashTitle: {
    fontFamily: 'sans-serif',      // TODO: 'Montelin'
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 16,
    textTransform: 'uppercase',
    color: Colors.textPrimary,
  },
  splashSubtitle: {
    fontFamily: 'sans-serif',
    fontSize: 12,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: Colors.softLavender,
    marginTop: 8,
  },
});
