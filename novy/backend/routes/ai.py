from flask import Blueprint, jsonify, request

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/resume", methods=["POST"])
def ai_resume():
    data = request.get_json() or {}
    skills = data.get("skills", "")
    projects = data.get("projects", "")

    # Pour l'instant, réponse mockée
    resume = f"Profil Novy : étudiant avec compétences {skills} et projets {projects}."

    return jsonify({
        "message": "Résumé IA généré (mock)",
        "resume": resume,
    }), 200