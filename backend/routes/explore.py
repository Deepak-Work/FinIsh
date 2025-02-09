from flask import Blueprint, request, jsonify, current_app
import psycopg2
from flask_jwt_extended import jwt_required, get_jwt_identity
from psycopg2 import sql


explore_bp = Blueprint('explore', __name__)

# Database connection helper function using the app config.
def get_db_connection():
    conn = psycopg2.connect(current_app.config['DATABASE_URI'])
    print(conn)
    return conn

@explore_bp.route('/update_user_video', methods=['POST'])
# @jwt_required()
def update_user_video():
    """
    API endpoint to update the user's last watched video ID in the database.
    Expected JSON format: { "userId": "user123", "videoId": "3xXUQEvf8v0" }
    """
    user_id = '040d735f-f5c5-4420-8392-4f2505bf9a0c'
    data = request.json
    print("Printing Data",data)
    try:
        print("trying to connect")
        conn = get_db_connection()
        cur = conn.cursor()
        update_count_query = sql.SQL("""
                UPDATE users
                SET total_watched = total_watched + 1, updated_at = NOW()
                WHERE user_id = %s
            """)
            
        cur.execute(update_count_query, (user_id,))
        conn.commit()

        update_video_tag_query = sql.SQL("""
                INSERT INTO enrollments (user_id, video_id, watched, watched_at, earned_credits)
                VALUES (%s, %s, %s, NOW(), %s)
                RETURNING enrollment_id
            """)
        
        earned_credits = 10
            
        cur.execute(update_video_tag_query, (user_id, data['id'], True, earned_credits))
        conn.commit()
        conn.close()

        return jsonify({"message": "User's video updated and total_watched incremented"}), 200
    except Exception as error:
        print("Error updating user video:", error)
        return jsonify({"error": "Internal server error"}), 500
