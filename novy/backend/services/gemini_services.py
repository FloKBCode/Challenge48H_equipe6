import os
import json
from typing import Dict, List, Optional

try:
    import requests
except ImportError:
    requests = None


class GeminiService:
    """Service Gemini en Python calqué sur src/services/geminiService.js.

    Cette classe expose la même API objet que le service front-end :
    - init_chat()
    - send_message(user_message, user_context)
    - clear_history()
    """

    OAUTH_BASE_URL = "https://generativelanguage.googleapis.com/v1beta2"
    APIKEY_BASE_URL = "https://generativelanguage.googleapis.com/v1beta"
    OAUTH_MODEL = "gemini-pro"
    APIKEY_MODEL = "gemini-flash-latest"
    API_ENDPOINT = "generateContent"
    REQUEST_TIMEOUT = 60
    CONTEXT_PREFIX = (
        "Tu es l'Assistant Novy d'Ynov Campus. "
        "Tu parles avec un étudiant. Sois concis. L'étudiant dit : "
    )

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError(
                "Clé API Gemini manquante. Définissez GEMINI_API_KEY dans l'environnement."
            )

        self.model_name = "gemini-pro"
        self.chat_session: Optional[Dict[str, object]] = None
        self.clear_history()

    def init_chat(self) -> None:
        """Initialise une nouvelle session de chat Gemini."""
        self.chat_session = {
            "history": [],
            "generationConfig": {"maxOutputTokens": 500},
        }

    def clear_history(self) -> None:
        """Supprime l'historique de la session et réinitialise la session."""
        self.chat_history: List[Dict[str, str]] = []
        self.chat_session = None

    def _build_prompt(self, user_message: str, user_context: Optional[Dict[str, str]] = None) -> str:
        """Construire le prompt Gemini à partir du message utilisateur et du contexte."""
        prompt = self.CONTEXT_PREFIX + user_message
        if user_context:
            context_parts = [f"{key}: {value}" for key, value in user_context.items()]
            prompt += "\nContexte utilisateur : " + "; ".join(context_parts)

        if self.chat_history:
            prompt += "\nHistorique de conversation :"
            for item in self.chat_history:
                role = item.get("role", "user")
                text = item.get("text", "")
                prompt += f"\n{role.capitalize()} : {text}"

        return prompt

    def _get_model_url(self, model_name: str, endpoint: str, use_apikey: bool) -> str:
        base_url = self.APIKEY_BASE_URL if use_apikey else self.OAUTH_BASE_URL
        return f"{base_url}/models/{model_name}:{endpoint}"

    def _extract_strings(self, obj) -> List[str]:
        strings: List[str] = []
        if isinstance(obj, str):
            strings.append(obj)
        elif isinstance(obj, dict):
            for value in obj.values():
                strings.extend(self._extract_strings(value))
        elif isinstance(obj, list):
            for item in obj:
                strings.extend(self._extract_strings(item))
        return strings

    def _score_text(self, text: str) -> float:
        t = text.strip()
        if len(t) < 10:
            return 0.0
        words = [w for w in t.split() if any(ch.isalpha() for ch in w)]
        if not words:
            return 0.0
        alpha_chars = sum(1 for ch in t if ch.isalpha())
        score = len(words) + alpha_chars / max(len(t), 1)
        return score

    def _best_text(self, texts: List[str]) -> str:
        candidates = [(self._score_text(text), text.strip()) for text in texts if text.strip()]
        candidates = [c for c in candidates if c[0] > 0]
        if not candidates:
            return ""
        candidates.sort(key=lambda item: (item[0], len(item[1])), reverse=True)
        return candidates[0][1]

    def _parse_response(self, data: dict) -> str:
        if isinstance(data, str):
            return data.strip()

        if isinstance(data, dict):
            if "candidates" in data and data["candidates"]:
                return self._parse_response(data["candidates"][0])
            if "output" in data:
                return self._best_text(self._extract_strings(data["output"]))
            if "content" in data:
                return self._best_text(self._extract_strings(data["content"]))
            if "text" in data and isinstance(data["text"], str):
                return data["text"].strip()

        if isinstance(data, list):
            return self._best_text(self._extract_strings(data))

        all_strings = self._extract_strings(data)
        best = self._best_text(all_strings)
        if best:
            return best

        raise RuntimeError(f"Réponse Gemini invalide : {json.dumps(data, ensure_ascii=False)}")

    def _request_gemini(self, prompt: str) -> str:
        if requests is None:
            raise ImportError(
                "Le package 'requests' est requis pour GeminiService. "
                "Installez-le avec 'pip install requests'."
            )

        headers = {"Content-Type": "application/json"}
        params: Dict[str, str] = {}

        use_apikey = self.api_key.startswith("AIza")
        if use_apikey:
            headers["X-Goog-Api-Key"] = self.api_key
            model_name = self.APIKEY_MODEL
            endpoint = self.API_ENDPOINT
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ]
            }
        else:
            headers["Authorization"] = f"Bearer {self.api_key}"
            model_name = self.OAUTH_MODEL
            endpoint = "generateText"
            payload = {
                "prompt": {"text": prompt},
                "temperature": 0.7,
                "maxOutputTokens": 500,
            }

        url = self._get_model_url(model_name, endpoint, use_apikey)
        response = requests.post(
            url,
            headers=headers,
            params=params,
            json=payload,
            timeout=self.REQUEST_TIMEOUT,
        )
        response.raise_for_status()
        data = response.json()
        return self._parse_response(data)

    def send_message(
        self,
        user_message: str,
        user_context: Optional[Dict[str, str]] = None,
        remember_history: bool = True,
    ) -> str:
        """Envoie un message à Gemini et retourne la réponse."""
        if self.chat_session is None:
            self.init_chat()

        prompt = self._build_prompt(user_message, user_context)

        try:
            ai_text = self._request_gemini(prompt)
        except Exception as error:
            return f"ERREUR_TECHNIQUE : {error}"

        if remember_history:
            self.chat_history.append({"role": "user", "text": user_message})
            self.chat_history.append({"role": "assistant", "text": ai_text})

        return ai_text

