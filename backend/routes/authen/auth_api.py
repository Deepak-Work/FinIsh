from flask import Blueprint, request, jsonify, make_response
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
import psycopg2
from flask_jwt_extended import create_access_token
from flask_jwt_extended import decode_token
from config import Config
from db import get_db_connection

auth_api_bp = Blueprint("auth_api", __name__)

@auth_api_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    print(username)
    print(password)

    if not (username and password):
        print("hello")
        return jsonify({"error": "Username and password are required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Fetch the user by username
        cur.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cur.fetchone()
        
        if user and bcrypt.checkpw(password.encode("utf-8"), user[4].encode("utf-8")):  # user[4] is the password_hash
            expires_at = datetime.now(timezone.utc) + timedelta(hours=1)  
            access_token = create_access_token(identity={"user_id": user[0], "username": user[1]})
            access_token = jwt.encode(
                    {"identity" : {"user_id": user[0], "username": user[1]}, "exp" : expires_at},
                    Config.SECRET_KEY, algorithm="HS256"
            )
            # Store the token in the database
            cur.execute(
                "INSERT INTO tokens (user_id, token_string, expires_at) VALUES (%s, %s, NOW() + INTERVAL '1 hour')",
                (user[0], access_token)
            )
            conn.commit()

            # Set the token in an HttpOnly cookie
            response = make_response(
                jsonify({"identity" : {"user_id": user[0], "username": user[1]}, "access_token": access_token, "message": "Login successful"})
            )
            response.set_cookie("jwtToken", access_token, httponly=True, secure=False, samesite="Strict", expires=datetime.now(timezone.utc) + timedelta(hours=1))
            return response

        else:
            print("hello!!")
            return jsonify({"message": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"message": "Error during login: " + str(e), "error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


@auth_api_bp.route("/validate-token", methods=["GET"])
def validate_token():
    # Retrieve the token from the cookies
    token = request.cookies.get("jwtToken")
    if not token:
        return jsonify({"message": "Token not found in cookies"}), 400
    conn = None
    try:
        # Decode and validate the JWT token using the secret key
        print("hello")
        # print(token)
        print(Config.SECRET_KEY)
        decoded_token = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        # decoded_token = decode_token(token)
        print(decoded_token)
        current_user = decoded_token.get("identity")
        print(current_user)
        if not current_user:
            return jsonify({"message": "Invalid or missing JWT token"}), 401
        # Check if the token exists in the database and is still valid (i.e. not expired and not marked invalid)
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM tokens 
                WHERE token_string = %s 
                  AND expires_at > NOW() 
                  AND is_invalid = FALSE
            """, (token,))
            valid_token = cursor.fetchone()
            if not valid_token:
                return jsonify({"message": "Token is invalid or expired"}), 401

        # Token is valid; return user data (using keys from the token's identity payload)
        return jsonify({
            "message": "Token is valid",
            "identity": {
                "user_id": current_user.get("user_id"),
                "username": current_user.get("username")
            }
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"message": "Error during token validation: " + str(e), "error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@auth_api_bp.route("/logout", methods=["GET"])
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