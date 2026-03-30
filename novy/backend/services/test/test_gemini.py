import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from services.gemini_services import GeminiService


def main():
    service = GeminiService()
    prompt = "Bonjour, présente-toi en quelques mots."
    reply = service.send_message(prompt)
    print("Prompt :", prompt)
    print("Réponse :", reply)


if __name__ == "__main__":
    main()
