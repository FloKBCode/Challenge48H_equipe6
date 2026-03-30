/**
 * api.js - Service de communication avec le Back-end Novy
 * 
 * Principe POO : Ce fichier est une "Classe Service" qui centralise TOUTES
 * les requêtes HTTP vers l'API. Bonne pratique : séparation des responsabilités.
 * 
 * URL de base : http://localhost:3000 (à adapter selon l'environnement)
 * Pour tester sur un vrai téléphone, remplacer 'localhost' par l'IP locale du PC.
 * 
 * @author Équipe Novy - Challenge 48H Paris Ynov Campus
 */

// URL de base de l'API Back-end (Node.js)
// IMPORTANT : Sur appareil physique, utiliser l'IP locale du PC (ex: http://192.168.1.50:3000)
const BASE_URL = 'http://192.168.7.1:3000/api'; // <--- IP du collègue (Backend)

/**
 * Classe ApiService - Gère toutes les communications avec le back-end
 * Utilisation du pattern Singleton : une seule instance dans toute l'app
 */
class ApiService {
  constructor() {
    this.baseUrl = BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    // Token d'authentification (stocké après login)
    this.authToken = null;
  }

  /**
   * Définit le token JWT après connexion
   * @param {string} token - Token JWT retourné par l'API
   */
  setAuthToken(token) {
    this.authToken = token;
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Méthode privée : construit les headers de la requête
   * @returns {Object} Headers HTTP
   */
  _buildHeaders() {
    return { ...this.defaultHeaders };
  }

  /**
   * Méthode générique pour les requêtes GET
   * @param {string} endpoint - URL de l'endpoint (ex: '/users')
   * @returns {Promise<Object>} Données JSON de la réponse
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this._buildHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[ApiService] GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Méthode générique pour les requêtes POST
   * @param {string} endpoint - URL de l'endpoint
   * @param {Object} body - Corps de la requête (JSON)
   * @returns {Promise<Object>} Données JSON de la réponse
   */
  async post(endpoint, body) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this._buildHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[ApiService] POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  // ============================================================
  //  AUTHENTIFICATION
  // ============================================================

  /**
   * Connexion utilisateur
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} { token, user }
   */
  async login(email, password) {
    // TODO: Route Back-end à définir -> POST /auth/login
    return this.post('/auth/login', { email, password });
  }

  /**
   * Inscription utilisateur
   * @param {Object} userData - { firstName, lastName, email, password, role }
   * @returns {Promise<Object>} { token, user }
   */
  async register(userData) {
    // TODO: Route Back-end à définir -> POST /auth/register
    return this.post('/auth/register', userData);
  }

  // ============================================================
  //  PROFIL UTILISATEUR
  // ============================================================

  /**
   * Récupère le profil d'un utilisateur
   * @param {number} userId
   * @returns {Promise<Object>} Données du profil
   */
  async getUserProfile(userId) {
    // TODO: Route Back-end à définir -> GET /users/:id
    return this.get(`/users/${userId}`);
  }

  /**
   * Met à jour le profil de l'utilisateur connecté
   * @param {number} userId
   * @param {Object} profileData
   */
  async updateProfile(userId, profileData) {
    // TODO: Route Back-end -> PUT /users/:id
    return this.post(`/users/${userId}/update`, profileData);
  }

  // ============================================================
  //  FIL D'ACTUALITÉ (FEED)
  // ============================================================

  /**
   * Récupère les publications du fil d'actualité
   * @returns {Promise<Array>} Liste des posts
   */
  async getFeed() {
    // TODO: Route Back-end -> GET /feed
    return this.get('/feed');
  }

  /**
   * Crée une nouvelle publication
   * @param {Object} postData - { content, authorId }
   */
  async createPost(postData) {
    // TODO: Route Back-end -> POST /feed
    return this.post('/feed', postData);
  }

  // ============================================================
  //  MESSAGERIE PRIVÉE
  // ============================================================

  /**
   * Récupère toutes les conversations de l'utilisateur
   * @returns {Promise<Array>} Liste des conversations
   */
  async getConversations() {
    // TODO: Route Back-end -> GET /messages/conversations
    return this.get('/messages/conversations');
  }

  /**
   * Récupère les messages d'une conversation
   * @param {number} conversationId
   */
  async getMessages(conversationId) {
    // TODO: Route Back-end -> GET /messages/:conversationId
    return this.get(`/messages/${conversationId}`);
  }

  /**
   * Envoie un message dans une conversation
   * @param {number} conversationId
   * @param {string} content
   */
  async sendMessage(conversationId, content) {
    // TODO: Route Back-end -> POST /messages/:conversationId
    return this.post(`/messages/${conversationId}`, { content });
  }

  // ============================================================
  //  JOB BOARD (YMATCH)
  // ============================================================

  /**
   * Récupère toutes les offres d'emploi
   * @returns {Promise<Array>} Liste des offres
   */
  async getJobOffers() {
    // TODO: Route Back-end -> GET /jobs
    return this.get('/jobs');
  }

  /**
   * Postule à une offre d'emploi
   * @param {number} jobId
   * @param {number} userId
   */
  async applyToJob(jobId, userId) {
    // TODO: Route Back-end -> POST /jobs/:id/apply
    return this.post(`/jobs/${jobId}/apply`, { userId });
  }

  // ============================================================
  //  NEWS YNOV
  // ============================================================

  /**
   * Récupère les actualités Ynov Campus
   * @returns {Promise<Array>} Liste des news
   */
  async getYnovNews() {
    // TODO: Route Back-end -> GET /news
    return this.get('/news');
  }
}

// Export d'une instance unique (Singleton)
export default new ApiService();
