from flask import Blueprint, request, jsonify, current_app
import psycopg2


profile_bp = Blueprint('profile', __name__)

def get_db_connection():
    conn = psycopg2.connect(current_app.config['DATABASE_URI'])
    print(conn)
    return conn

@profile_bp.route('/<user_id>', methods=['GET'])
def get_user_details(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Fetch user details
        print("Getting Usr id:",user_id)
        cursor.execute("""
            SELECT user_id, full_name, username, email, bio, profile_picture_url, credits, total_watched, total_questions, total_answers, created_at
            FROM users
            WHERE user_id = %s;
        """, (user_id,))

        # Get user details
        user = cursor.fetchone()
        print(user)
        if user:
            user_details = {
                'user_id': user[0],
                'full_name': user[1],
                'username': user[2],
                'email': user[3],
                'bio': user[4],
                'profile_picture_url': user[5],
                'credits': user[6],
                'total_watched': user[7],
                'total_questions': user[8],
                'total_answers': user[9],
                'created_at': user[10]
            }
            cursor.close()
            conn.close()
            return jsonify(user_details), 200
        else:
            cursor.close()
            conn.close()
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        print("Error fetching user details:", e)
        return jsonify({"error": "Internal Server Error"}), 500