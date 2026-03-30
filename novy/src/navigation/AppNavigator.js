/**
 * AppNavigator.js - Gestionnaire de navigation de l'application Novy
 * 
 * Structure de navigation :
 * - AuthScreen : Écran racine (hors onglets, avant connexion)
 * - MainApp (Tab Navigator) : 5 onglets principaux
 *     ├── Feed (Fil d'actualité)
 *     ├── Messages (Messagerie privée)
 *     ├── Profile (Profil utilisateur)
 *     └── JobBoard (Ymatch)
 * - ChatbotScreen : Accessible depuis le profil (hors onglets)
 * 
 * Design : Tab bar avec le thème Dark Slate / Soft Lavender.
 * @author Équipe Novy - Challenge 48H Paris Ynov Campus
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, BorderRadius } from '../constants/theme';

// Import des écrans
import AuthScreen from '../screens/AuthScreen';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import JobBoardScreen from '../screens/JobBoardScreen';
import ChatbotScreen from '../screens/ChatbotScreen';

// ============================================================
//  NAVIGATEURS
// ============================================================
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ============================================================
//  ICÔNES DE LA TAB BAR (emoji comme fallback en attendant les assets)
// ============================================================
/**
 * Retourne l'icône correspondant à chaque onglet
 * TODO : Remplacer par des icônes SVG ou @expo/vector-icons pour un rendu premium
 * @param {string} routeName - Nom de la route
 * @param {boolean} focused - Onglet actif ?
 * @returns {string} Emoji représentant l'onglet
 */
const getTabIcon = (routeName, focused) => {
  const icons = {
    Feed: focused ? '🏠' : '🏚️',
    Messages: focused ? '💬' : '💭',
    Profile: focused ? '👤' : '🔘',
    JobBoard: focused ? '💼' : '🗂️',
  };
  return icons[routeName] || '⭕';
};

// ============================================================
//  COMPOSANT : Tab Bar personnalisée avec labels stylisés
// ============================================================
/**
 * Composant d'icône personnalisé pour chaque onglet
 */
const TabBarIcon = ({ routeName, focused, label }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
    <Text style={styles.tabEmoji}>{getTabIcon(routeName, focused)}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
  </View>
);

// ============================================================
//  NAVIGATION PRINCIPALE (Tab Navigator)
// ============================================================
/**
 * Onglets principaux de l'application
 * Accessibles une fois l'utilisateur connecté
 */
const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Masquer le header par défaut (on gère nos propres headers)
        headerShown: false,

        // Configuration de la Tab Bar
        tabBarStyle: [
          styles.tabBar,
          { 
            height: Platform.OS === 'ios' ? 100 + (insets.bottom > 0 ? insets.bottom - 20 : 0) : 90,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          }
        ],
        tabBarItemStyle: {
          height: 70, // Donner une hauteur fixe décente à l'item
          marginVertical: 5,
        },
        tabBarShowLabel: false,   // On gère les labels manuellement

        // Icône personnalisée pour chaque tab
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            routeName={route.name}
            focused={focused}
            label={
              route.name === 'Feed' ? 'Accueil' :
              route.name === 'Messages' ? 'Messages' :
              route.name === 'Profile' ? 'Profil' :
              'Ymatch'
            }
          />
        ),

        // Couleur des éléments actifs/inactifs
        tabBarActiveTintColor: Colors.softLavender,
        tabBarInactiveTintColor: Colors.textMuted,
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="JobBoard" component={JobBoardScreen} />
    </Tab.Navigator>
  );
};

// ============================================================
//  NAVIGATEUR RACINE (Stack Navigator)
// ============================================================
/**
 * Stack Navigator racine qui gère :
 * - L'écran d'authentification (avant connexion)
 * - L'application principale (après connexion)
 * - L'écran du Chatbot (accessible depuis le profil)
 */
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      {/* Écran de connexion/inscription */}
      <Stack.Screen name="Auth" component={AuthScreen} />

      {/* Application principale (onglets) */}
      <Stack.Screen name="MainApp" component={MainTabNavigator} />

      {/* Chatbot IA - Accessible depuis le profil */}
      <Stack.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          animation: 'slide_from_bottom',  // Animation slide up
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

// ============================================================
//  STYLES DE LA TAB BAR
// ============================================================
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 12, // Un peu plus d'espace en haut
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 8, // Augmenté pour donner de l'espace vertical
    borderRadius: BorderRadius.lg,
    minHeight: 55, // Forcer une hauteur suffisante pour l'icône + le texte
    width: 70,
  },
  tabIconContainerActive: {
    backgroundColor: 'rgba(165, 137, 191, 0.15)',
  },
  tabEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10, // R�tabli � 10 pour �viter le clipping
    fontWeight: '700', // Augmenté de 600 à 700
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  tabLabelActive: {
    color: Colors.softLavender,
    fontWeight: '800',
  },
});

export default AppNavigator;
