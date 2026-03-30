# 🎓 NOVY — Réseau Social Paris Ynov Campus

> **Challenge 48H** — Équipe 6 — Paris Ynov Campus Nanterre

## 📱 Description

**Novy** est le réseau social exclusif de l'école Paris Ynov Campus. Il connecte les talents (étudiants, professeurs, intervenants), valorise leurs projets et centralise la vie du campus.

---

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| **Front-end Mobile** | React Native + Expo Go |
| **Navigation** | React Navigation (Tab + Stack) |
| **Back-end** | Node.js (API REST) |
| **Base de données** | MySQL |
| **IA** | Google Gemini (via Back-end) |
| **Paradigme** | Programmation Orientée Objet (POO) |

---

## 📁 Architecture du Projet

```
novy/
├── App.js                        # Point d'entrée, chargement polices
├── assets/
│   └── fonts/                    # ⚠️ Placer ici les .ttf (Montelin, Mansalva, BrittanySignature)
└── src/
    ├── constants/
    │   └── theme.js              # Design System (couleurs, polices, espacements)
    ├── data/
    │   └── mockData.js           # Données JSON factices pour les tests
    ├── navigation/
    │   └── AppNavigator.js       # Tab Navigator + Stack Navigator
    ├── screens/
    │   ├── AuthScreen.js         # Connexion / Inscription
    │   ├── FeedScreen.js         # Fil d'actualité + News Ynov
    │   ├── ProfileScreen.js      # Profil utilisateur + compétences
    │   ├── MessagesScreen.js     # Messagerie privée
    │   ├── JobBoardScreen.js     # Ymatch (offres emploi/stage)
    │   └── ChatbotScreen.js      # 🤖 Assistant Novy IA (Gemini)
    └── services/
        ├── api.js                # Service HTTP (fetch vers Back-end)
        └── geminiService.js      # Service Chatbot Gemini
```

---

## 🎨 Charte Graphique

| Couleur | Hex | Usage |
|---------|-----|-------|
| Dark Slate | `#2A2D30` | Fond principal |
| Soft Lavender | `#A589BF` | Accent principal, boutons |
| Dusky Rose | `#EFD9E6` | Fonds de cartes |
| Sage Green | `#7D8D8B` | Textes secondaires |
| Soft Mint | `#C2E1D5` | Tags, badges |
| Magenta Pink | `#E395C8` | Notifications, CTA |
| Deep Teal | `#349B9E` | Liens, salaires |

**Polices :**
- **Montelin** → Titres en majuscules
- **Mansalva** → Textes informatifs
- **Brittany Signature** → Éléments décoratifs

---

## 🚀 Installation & Lancement

### Prérequis
- Node.js >= 18
- Expo Go sur ton téléphone (iOS / Android)
- npm >= 9

### Installation
```bash
cd novy
npm install
```

### Lancement
```bash
npx expo start
```

Scanne le QR code avec **Expo Go** sur ton téléphone.

> ⚠️ Pour tester sur téléphone physique, modifier `BASE_URL` dans `src/services/api.js` :
> ```js
> const BASE_URL = 'http://192.168.X.X:3000'; // Ton IP locale
> ```

---

## 🔤 Ajouter les Polices Custom

1. Télécharger les `.ttf` sur DaFont / Google Fonts
2. Les placer dans `assets/fonts/`
3. Dans `App.js`, décommenter les lignes :
   ```js
   'Montelin': require('./assets/fonts/Montelin.ttf'),
   'Mansalva': require('./assets/fonts/Mansalva.ttf'),
   'BrittanySignature': require('./assets/fonts/BrittanySignature.ttf'),
   ```
4. Dans `src/constants/theme.js`, remplacer `'sans-serif'` par les noms des polices

---

## 🤖 Intégration Gemini (Chatbot)

Le chatbot IA est prêt côté Front-end (`src/services/geminiService.js`).

Le Back-end doit exposer la route :
```
POST http://localhost:3000/ai/chat
Body: { message: string, history: [], context: {} }
Response: { reply: string }
```

---

## 👥 Équipe

- **[Ton nom]** — Front-end React Native / Expo
- **[Collègue B2]** — Back-end Node.js + MySQL

---

*Challenge 48H — Paris Ynov Campus — Mars 2026*
