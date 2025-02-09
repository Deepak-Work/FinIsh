from flask import Blueprint, request, jsonify, make_response
from datetime import datetime, timedelta, timezone
import bcrypt
import psycopg2
from flask_jwt_extended import create_access_token
from db import get_db_connection

login_bp = Blueprint("login", __name__)

@login_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not (username and password):
        return jsonify({"error": "Username and password are required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Fetch the user by username
        cur.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cur.fetchone()
        
        if user and bcrypt.checkpw(password.encode("utf-8"), user[4].encode("utf-8")):  # user[4] is the password_hash
            access_token = create_access_token(identity={"user_id": user[0], "username": user[1]})
            
            # Store the token in the database
            cur.execute(
                "INSERT INTO tokens (user_id, token_string, expires_at) VALUES (%s, %s, NOW() + INTERVAL '1 hour')",
                (user[0], access_token)
            )
            conn.commit()

            # Set the token in an HttpOnly cookie
            response = make_response(
                jsonify({"access_token": access_token, "message": "Login successful"})
            )
            response.set_cookie("jwtToken", access_token, httponly=True, secure=False, samesite="Strict", expires=datetime.now(timezone.utc) + timedelta(hours=1))
            return response

        else:
            return jsonify({"message": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"message": "Error during login: " + str(e), "error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@login_bp.route("/logout", methods=["POST"])
def logout():
    token = request.cookies.get("jwtToken")
    if not token:
        return jsonify({"message": "No token found in cookies"}), 400

    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("UPDATE tokens SET is_invalid = TRUE WHERE token_string = %s", (token,))
            conn.commit()

        response = make_response(jsonify({"message": "Logged out successfully"}))
        response.set_cookie("jwtToken", "", expires=0, httponly=True, secure=False, samesite="Strict")
        return response
    except Exception as e:
        return jsonify({"message": "Error during logout", "error": str(e)}), 500
    finally:
        if conn:
            conn.close()