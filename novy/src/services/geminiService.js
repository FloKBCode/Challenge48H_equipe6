import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.API_KEY = 'AIzaSyBfcdpufpwpoaP9PH-IWhnyeYfuvpqL4z4';
    this.genAI = new GoogleGenerativeAI(this.API_KEY);
    // On repasse sur le modèle gemini-pro standard qui est garanti dispo sur toutes les régions et versions API
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.chatSession = null;
  }

  initChat() {
    this.chatSession = this.model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });
  }

  async sendMessage(userMessage, userContext = {}) {
    try {
      if (!this.chatSession) {
        this.initChat();
      }

      // Hack pour forcer le contexte avec gemini-pro (qui ne supporte pas toujours systemInstruction)
      const contextPrefix = "Tu es l'Assistant Novy d'Ynov Campus. Tu parles avec un étudiant. Sois concis. L'étudiant dit : ";
      const result = await this.chatSession.sendMessage(contextPrefix + userMessage);
      
      return result.response.text();

    } catch (error) {
      console.error('[GeminiService] Erreur API:', error.message);
      return "ERREUR_TECHNIQUE : " + error.message;
    }
  }

  clearHistory() {
    this.chatSession = null;
  }
}

export default new GeminiService();
