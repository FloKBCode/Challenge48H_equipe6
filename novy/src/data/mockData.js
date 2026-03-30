/**
 * mockData.js - Données factices pour les tests de développement
 * 
 * Ce fichier simule les réponses de l'API Back-end (Node.js / MySQL).
 * Il sera remplacé par de vraies requêtes fetch dès que les routes seront prêtes.
 * 
 * Structure JSON conforme au cahier des charges Novy.
 * @author Équipe Novy - Challenge 48H Paris Ynov Campus
 */

// ============================================================
//  PROFIL DE L'UTILISATEUR CONNECTÉ
// ============================================================
export const currentUserProfile = {
  id: 1,
  firstName: 'Lucas',
  lastName: 'Martin',
  role: 'Étudiant B1',
  filiere: 'Développement Web & Mobile',
  bio: 'Passionné par React Native et le design UI/UX. En recherche d\'une alternance pour l\'année prochaine.',
  skills: ['JavaScript', 'React Native', 'Figma', 'HTML/CSS'],
  avatarUrl: 'https://i.pravatar.cc/150?img=11',
  followers: 128,
  following: 64,
  projects: 5,
};

// ============================================================
//  UTILISATEURS (Contacts / Expéditeurs de messages)
// ============================================================
export const users = [
  {
    id: 2,
    firstName: 'Sophie',
    lastName: 'Blanchard',
    role: 'Étudiante B2 Lead',
    filiere: 'Développement Web & Mobile',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    isOnline: true,
  },
  {
    id: 3,
    firstName: 'Théo',
    lastName: 'Dupont',
    role: 'Intervenant',
    filiere: 'Data Science & IA',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    isOnline: false,
  },
  {
    id: 4,
    firstName: 'Amina',
    lastName: 'Koné',
    role: 'Étudiante B1',
    filiere: 'Cybersécurité',
    avatarUrl: 'https://i.pravatar.cc/150?img=23',
    isOnline: true,
  },
];

// ============================================================
//  CONVERSATIONS (MESSAGERIE PRIVÉE)
// ============================================================
export const conversations = [
  {
    id: 1,
    participantId: 2,
    participantName: 'Sophie Blanchard',
    participantAvatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'Oui, le rendu avec le Soft Lavender rend super bien !',
    lastMessageTime: '10:18',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 2,
    participantId: 3,
    participantName: 'Théo Dupont',
    participantAvatar: 'https://i.pravatar.cc/150?img=3',
    lastMessage: 'Tu as regardé le cours sur le Machine Learning ?',
    lastMessageTime: 'Hier',
    unreadCount: 3,
    isOnline: false,
  },
  {
    id: 3,
    participantId: 4,
    participantName: 'Amina Koné',
    participantAvatar: 'https://i.pravatar.cc/150?img=23',
    lastMessage: 'On push le projet sur GitHub ce soir ?',
    lastMessageTime: 'Lun.',
    unreadCount: 1,
    isOnline: true,
  },
];

// ============================================================
//  MESSAGES D'UNE CONVERSATION (Exemple avec Sophie)
// ============================================================
export const messages = [
  {
    id: 1,
    senderId: 2,
    senderName: 'Sophie (B2 Lead)',
    content: 'Salut Lucas, tu as pu avancer sur l\'écran de connexion avec la nouvelle charte graphique ?',
    timestamp: '2026-03-30T10:15:00Z',
    isMine: false,
  },
  {
    id: 2,
    senderId: 1,
    senderName: 'Lucas',
    content: 'Oui, le rendu avec le Soft Lavender et le Dark Slate rend super bien ! Je push ça sur Github dans 10 minutes.',
    timestamp: '2026-03-30T10:18:00Z',
    isMine: true,
  },
  {
    id: 3,
    senderId: 2,
    senderName: 'Sophie (B2 Lead)',
    content: 'Parfait ! N\'oublie pas de bien commenter le code pour la soutenance demain.',
    timestamp: '2026-03-30T10:20:00Z',
    isMine: false,
  },
  {
    id: 4,
    senderId: 1,
    senderName: 'Lucas',
    content: 'C\'est noté, je vais aussi finir l\'écran du Feed ce soir. On est dans les temps !',
    timestamp: '2026-03-30T10:22:00Z',
    isMine: true,
  },
];

// ============================================================
//  FIL D'ACTUALITÉ (FEED)
// ============================================================
export const feedPosts = [
  {
    id: 1,
    authorId: 3,
    authorName: 'Théo Dupont',
    authorRole: 'Intervenant Data Science',
    authorAvatar: 'https://i.pravatar.cc/150?img=3',
    content: '🚀 Super session de Deep Learning aujourd\'hui ! Les étudiants B2 ont présenté des projets impressionnants. La prochaine génération de développeurs IA est là ! #YnovCampus #MachineLearning',
    timestamp: '2026-03-30T09:00:00Z',
    timeAgo: 'Il y a 3h',
    likes: 42,
    comments: 8,
    isLiked: false,
    tags: ['IA', 'MachineLearning', 'YnovCampus'],
  },
  {
    id: 2,
    authorId: 4,
    authorName: 'Amina Koné',
    authorRole: 'Étudiante B1 Cybersécurité',
    authorAvatar: 'https://i.pravatar.cc/150?img=23',
    content: '🔐 Premier CTF validé avec succès ! La cybersécurité, c\'est fun. Si vous voulez former un groupe pour le prochain événement, DM-moi ! #Cybersec #CTF #Ynov',
    timestamp: '2026-03-30T08:30:00Z',
    timeAgo: 'Il y a 4h',
    likes: 28,
    comments: 5,
    isLiked: true,
    tags: ['Cybersec', 'CTF'],
  },
  {
    id: 3,
    authorId: 1,
    authorName: 'Lucas Martin',
    authorRole: 'Étudiant B1 Dev Web & Mobile',
    authorAvatar: 'https://i.pravatar.cc/150?img=11',
    content: '📱 Challenge 48H en cours ! Notre équipe code le réseau social de l\'école avec React Native et Expo. Novy va déchirer ! On tient le cap 💪 #Challenge48H #React Native #TeamWork',
    timestamp: '2026-03-30T07:00:00Z',
    timeAgo: 'Il y a 5h',
    likes: 67,
    comments: 14,
    isLiked: false,
    tags: ['Challenge48H', 'ReactNative'],
  },
];

// ============================================================
//  NEWS YNOV (Encart spécial dans le Feed)
// ============================================================
export const ynovNews = [
  {
    id: 1,
    title: '🎓 Journée Portes Ouvertes - 15 Avril',
    content: 'Venez découvrir nos formations et rencontrer les intervenants professionnels. Inscription obligatoire sur le site Ynov.',
    date: '15 Avril 2026',
    category: 'Événement',
    isImportant: true,
  },
  {
    id: 2,
    title: '🏆 Challenge 48H - Résultats',
    content: 'Les équipes finalistes seront annoncées vendredi. Les 3 meilleures équipes pitcheront devant l\'ensemble des étudiants.',
    date: '31 Mars 2026',
    category: 'Challenge',
    isImportant: true,
  },
  {
    id: 3,
    title: '📚 Nouveau cours IA disponible',
    content: 'Le module "Introduction à Google Gemini API" est maintenant disponible sur la plateforme e-learning.',
    date: '28 Mars 2026',
    category: 'Formation',
    isImportant: false,
  },
];

// ============================================================
//  JOB BOARD - YMATCH (Offres de stage / alternance / emploi)
// ============================================================
export const jobOffers = [
  {
    id: 1,
    title: 'Développeur React Native - Alternance',
    company: 'TechStart Paris',
    location: 'Paris 8ème',
    type: 'Alternance',
    duration: '12 mois',
    skills: ['React Native', 'JavaScript', 'Git'],
    salary: '900€/mois',
    postedAt: 'Hier',
    isNew: true,
    description: 'Rejoignez notre startup en pleine croissance pour développer notre app mobile. Bonne ambiance garantie !',
    contactEmail: 'rh@techstart.fr',
    logo: 'https://i.pravatar.cc/50?img=60',
  },
  {
    id: 2,
    title: 'Analyste Cybersécurité - Stage',
    company: 'SecureNet SARL',
    location: 'La Défense',
    type: 'Stage',
    duration: '6 mois',
    skills: ['Python', 'Wireshark', 'Linux'],
    salary: '700€/mois',
    postedAt: 'Il y a 3j',
    isNew: false,
    description: 'Stage en pentesting et analyse de vulnérabilités dans un cabinet spécialisé en cybersécurité.',
    contactEmail: 'contact@securenet.fr',
    logo: 'https://i.pravatar.cc/50?img=61',
  },
  {
    id: 3,
    title: 'Full Stack Developer - CDI',
    company: 'NovAgency',
    location: 'Paris / Remote',
    type: 'CDI',
    duration: 'Permanent',
    skills: ['Node.js', 'React', 'MySQL', 'Docker'],
    salary: '38K-45K€/an',
    postedAt: 'Aujourd\'hui',
    isNew: true,
    description: 'Agence digitale cherche développeur full-stack expérimenté pour rejoindre une équipe de 15 personnes.',
    contactEmail: 'jobs@novagency.com',
    logo: 'https://i.pravatar.cc/50?img=62',
  },
  {
    id: 4,
    title: 'UI/UX Designer - Freelance',
    company: 'Créatif Studio',
    location: 'Paris / Remote',
    type: 'Freelance',
    duration: 'Mission 3 mois',
    skills: ['Figma', 'Adobe XD', 'Prototypage'],
    salary: '300€/jour',
    postedAt: 'Il y a 2j',
    isNew: false,
    description: 'Mission de refonte UI pour une application SaaS B2B. Portfolio requis.',
    contactEmail: 'mission@creatif.studio',
    logo: 'https://i.pravatar.cc/50?img=63',
  },
];

// ============================================================
//  EXPORT PAR DÉFAUT
// ============================================================
export default {
  currentUserProfile,
  users,
  conversations,
  messages,
  feedPosts,
  ynovNews,
  jobOffers,
};
