from flask import Blueprint, request, jsonify
from passlib.hash import bcrypt
import jwt
from datetime import datetime, timedelta

from models.database import get_connection
from config import JWT_SECRET, JWT_ALGO

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    first_name = data.get("first_name")
    last_name = data.get("last_name")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    existing = cursor.fetchone()
    if existing:
        cursor.close()
        conn.close()
        return jsonify({"message": "Email déjà utilisé"}), 409

    password_hash = bcrypt.hash(password)

    cursor.execute(
        """
        INSERT INTO users (email, password_hash, first_name, last_name)
        VALUES (%s, %s, %s, %s)
        """,
        (email, password_hash, first_name, last_name),
    )
    conn.commit()
    user_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Utilisateur créé",
        "user": {
            "id": user_id,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
        },
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email et mot de passe requis"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user or not bcrypt.verify(password, user["password_hash"]):
        return jsonify({"message": "Identifiants invalides"}), 401

    payload = {
        "userId": user["id"],
        "email": user["email"],
        "exp": datetime.utcnow() + timedelta(days=1),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

    return jsonify({
        "message": "Connexion réussie",
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
        },
    }), 200