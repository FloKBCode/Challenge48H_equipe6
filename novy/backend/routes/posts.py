from flask import Blueprint, request, jsonify
from models.database import get_connection

posts_bp = Blueprint("posts", __name__)

@posts_bp.route("/", methods=["GET"])
def get_posts():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT p.id,
               p.content,
               p.image_url,
               p.created_at,
               p.is_news,
               u.first_name,
               u.last_name
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        """
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    posts = [
        {
            "id": row["id"],
            "author": f'{row["first_name"]} {row["last_name"]}',
            "content": row["content"],
            "image_url": row["image_url"],
            "created_at": row["created_at"].isoformat() if row["created_at"] else None,
            "is_news": bool(row["is_news"]),
        }
        for row in rows
    ]

    return jsonify(posts), 200

@posts_bp.route("/", methods=["POST"])
def create_post():
    data = request.get_json() or {}
    user_id = data.get("user_id")
    content = data.get("content")
    image_url = data.get("image_url")
    is_news = data.get("is_news", False)

    if not user_id or not content:
        return jsonify({"message": "user_id and content required"}), 400

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO posts (user_id, content, image_url, is_news)
        VALUES (%s, %s, %s, %s)
        """,
        (user_id, content, image_url, is_news),
    )
    conn.commit()
    post_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Post created",
        "post": {
            "id": post_id,
            "user_id": user_id,
            "content": content,
            "image_url": image_url,
            "is_news": is_news,
        },
    }), 201