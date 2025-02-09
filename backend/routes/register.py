from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify
import bcrypt
import psycopg2
from db import get_db_connection

register_bp = Blueprint("register", __name__)

@register_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    full_name = data.get("full_name")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not (full_name and username and email and password):
        return jsonify({"error": "All fields are required"}), 400

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO users (full_name, username, email, password_hash) VALUES (%s, %s, %s, %s) RETURNING user_id",
            (full_name, username, email, hashed_password)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        
        # Generate JWT token after registration
        access_token = generate_token(user_id, username)
        
        return jsonify({"message": "User registered successfully", "access_token": access_token}), 201
    except psycopg2.Error as e:
        conn.rollback()
        return jsonify({"error": "Error registering user", "details": str(e)}), 500
    finally:
        cur.close()
        conn.close()

def generate_token(user_id, username):
    from flask_jwt_extended import create_access_token
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    access_token = create_access_token(identity={"user_id": user_id, "username": username}, expires_delta=timedelta(hours=1))
    return access_token