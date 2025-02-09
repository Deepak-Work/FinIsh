from flask import Blueprint, request, jsonify, current_app
import psycopg2
from flask_jwt_extended import jwt_required, get_jwt_identity
from psycopg2 import sql


enrollment_bp = Blueprint('enrollments', __name__)

# Database connection helper function using the app config.
def get_db_connection():
    conn = psycopg2.connect(current_app.config['DATABASE_URI'])
    print(conn)
    return conn


@enrollment_bp.route('/get_user_data', methods=['GET'])
def get_user_data():
    user_id = '7f4e6426-1202-4ff5-a969-eb8adb24c267';#request.args.get('user_id')  # Get user_id from request parameters

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Get videos user has interacted with
        cur.execute("""
            SELECT v.video_id, v.title, v.video_url
            FROM enrollments e
            JOIN videos v ON e.video_id = v.video_id
            WHERE e.user_id = %s
        """, (user_id,))
        videos = [{"video_id": row[0], "title": row[1], "url": row[2]} for row in cur.fetchall()]

        # Get questions user has asked
        cur.execute("""
            SELECT question_id, title
            FROM questions
            WHERE user_id = %s
        """, (user_id,))
        questions_asked = [{"question_id": row[0], "title": row[1]} for row in cur.fetchall()]

        # Get questions user has answered
        cur.execute("""
            SELECT q.question_id, q.title
            FROM answers a
            JOIN questions q ON a.question_id = q.question_id
            WHERE a.user_id = %s
        """, (user_id,))
        questions_answered = [{"question_id": row[0], "title": row[1]} for row in cur.fetchall()]

        print(videos)
        print(questions_answered)
        print(questions_answered)

        # Close connections
        cur.close()
        conn.close()

        return jsonify({
            "videos": videos,
            "questions_asked": questions_asked,
            "questions_answered": questions_answered
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
