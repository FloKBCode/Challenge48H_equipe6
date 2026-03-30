from flask import Blueprint, jsonify, request
from models.database import get_connection

messages_bp = Blueprint("messages", __name__)

@messages_bp.route("/", methods=["GET"])
def list_messages():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"message": "user_id requis"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT m.id,
               m.content,
               m.sent_at,
               s.first_name AS sender_first,
               s.last_name AS sender_last,
               r.first_name AS receiver_first,
               r.last_name AS receiver_last
        FROM messages m
        JOIN users s ON m.sender_id = s.id
        JOIN users r ON m.receiver_id = r.id
        WHERE m.sender_id = %s OR m.receiver_id = %s
        ORDER BY m.sent_at DESC
        """,
        (user_id, user_id),
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    msgs = [
        {
            "id": row["id"],
            "content": row["content"],
            "sent_at": row["sent_at"].isoformat() if row["sent_at"] else None,
            "sender": f'{row["sender_first"]} {row["sender_last"]}',
            "receiver": f'{row["receiver_first"]} {row["receiver_last"]}',
        }
        for row in rows
    ]

    return jsonify(msgs), 200