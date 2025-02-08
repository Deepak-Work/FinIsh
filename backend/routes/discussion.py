import uuid
import psycopg2
from flask import Blueprint, request, jsonify, abort, current_app

# Create a Blueprint for discussion-related routes.
discussion_bp = Blueprint('discussion', __name__)

# Database connection helper function using the app config.
def get_db_connection():
    conn = psycopg2.connect(current_app.config['DATABASE_URI'])
    return conn

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# 1) Fetch all Questions (GET /questions)
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@discussion_bp.route('/questions', methods=['GET'])
def fetch_all_questions():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT question_id, user_id, title, body, total_views, created_at, updated_at 
        FROM questions
        ORDER BY created_at DESC
    """)
    rows = cur.fetchall()
    questions = []
    for row in rows:
        questions.append({
            "question_id": row[0],
            "user_id": row[1],
            "title": row[2],
            "body": row[3],
            "total_views": row[4],
            "created_at": row[5],
            "updated_at": row[6]
        })
    cur.close()
    conn.close()
    return jsonify(questions), 200

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# 2) Get all Answers for a given Question (GET /questions/<qid>/answers)
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@discussion_bp.route('/questions/<question_id>/answers', methods=['GET'])
def fetch_answers_for_question(question_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT answer_id, question_id, user_id, body, total_upvotes, created_at, updated_at
        FROM answers
        WHERE question_id = %s
        ORDER BY created_at ASC
    """, (question_id,))
    rows = cur.fetchall()
    answers = []
    for row in rows:
        answers.append({
            "answer_id": row[0],
            "question_id": row[1],
            "user_id": row[2],
            "body": row[3],
            "total_upvotes": row[4],
            "created_at": row[5],
            "updated_at": row[6]
        })
    cur.close()
    conn.close()
    return jsonify(answers), 200

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# 3) Add an Answer for a given question (POST /questions/<qid>/answers)
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@discussion_bp.route('/questions/<question_id>/answers', methods=['POST'])
def add_answer(question_id):
    data = request.get_json()
    user_id = data.get('user_id')
    body = data.get('body')
    if not user_id or not body:
        abort(400, description="Missing user_id or body in request data.")
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO answers (question_id, user_id, body)
        VALUES (%s, %s, %s)
        RETURNING answer_id
    """, (question_id, user_id, body))
    answer_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"answer_id": answer_id}), 201

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# 4) Update an Answer (PUT /answers/<answer_id>)
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@discussion_bp.route('/answers/<answer_id>', methods=['PUT'])
def update_answer(answer_id):
    data = request.get_json()
    body = data.get('body')
    if not body:
        abort(400, description="Missing answer body in request data.")
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE answers
        SET body = %s, updated_at = NOW()
        WHERE answer_id = %s
    """, (body, answer_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Answer updated"}), 200

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# 4b) Delete an Answer (DELETE /answers/<answer_id>)
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@discussion_bp.route('/answers/<answer_id>', methods=['DELETE'])
def delete_answer(answer_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM answers WHERE answer_id = %s", (answer_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Answer deleted"}), 200

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#####################################
# 5) Modify Upvote of an Answer (POST /answers/<answer_id>/upvote)
#
# Expected JSON body: { "user_id": "<user_id>" }
# Behavior:
#  - If the answer_id exists in the user's answers_id_upvoted array, remove it and decrement answer.total_upvotes.
#  - Otherwise, add it and increment answer.total_upvotes.
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#####################################
@discussion_bp.route('/answers/<answer_id>/upvote', methods=['POST'])
def modify_upvote(answer_id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        abort(400, description="Missing user_id in request data.")

    conn = get_db_connection()
    cur = conn.cursor()

    # Retrieve current upvoted answer IDs for the user.
    cur.execute("SELECT answers_id_upvoted FROM users WHERE user_id = %s", (user_id,))
    result = cur.fetchone()
    if not result:
        abort(404, description="User not found.")
    upvoted = result[0]  # Expected to be a list (PostgreSQL array)
    if upvoted is None:
        upvoted = []

    # Check if the answer is already upvoted.
    if answer_id in upvoted:
        # Remove the upvote.
        upvoted.remove(answer_id)
        cur.execute("""
            UPDATE answers
            SET total_upvotes = total_upvotes - 1, updated_at = NOW()
            WHERE answer_id = %s
        """, (answer_id,))
        action = "removed"
    else:
        # Add the upvote.
        upvoted.append(answer_id)
        cur.execute("""
            UPDATE answers
            SET total_upvotes = total_upvotes + 1, updated_at = NOW()
            WHERE answer_id = %s
        """, (answer_id,))
        action = "added"
    
    # Update the user's answers_id_upvoted array.
    cur.execute("""
        UPDATE users
        SET answers_id_upvoted = %s, updated_at = NOW()
        WHERE user_id = %s
    """, (upvoted, user_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": f"Upvote {action} for answer {answer_id}"}), 200

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# 6) Get a Question by question_id (GET /questions/<question_id>)
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@discussion_bp.route('/questions/<question_id>', methods=['GET'])
def get_question(question_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT question_id, user_id, title, body, total_views, created_at, updated_at
        FROM questions
        WHERE question_id = %s
    """, (question_id,))
    row = cur.fetchone()
    if row is None:
        abort(404, description="Question not found.")
    question = {
        "question_id": row[0],
        "user_id": row[1],
        "title": row[2],
        "body": row[3],
        "total_views": row[4],
        "created_at": row[5],
        "updated_at": row[6]
    }
    cur.close()
    conn.close()
    return jsonify(question), 200

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# 7) Add a Question (POST /questions)
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@discussion_bp.route('/questions', methods=['POST'])
def add_question():
    data = request.get_json()
    user_id = data.get('user_id')
    title = data.get('title')
    body = data.get('body')
    if not user_id or not title or not body:
        abort(400, description="Missing user_id, title, or body in request data.")
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO questions (user_id, title, body)
        VALUES (%s, %s, %s)
        RETURNING question_id
    """, (user_id, title, body))
    question_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"question_id": question_id}), 201

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# 8) Edit a Question (PUT /questions/<question_id>)
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@discussion_bp.route('/questions/<question_id>', methods=['PUT'])
def edit_question(question_id):
    data = request.get_json()
    title = data.get('title')
    body = data.get('body')
    if not title or not body:
        abort(400, description="Missing title or body in request data.")
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE questions
        SET title = %s, body = %s, updated_at = NOW()
        WHERE question_id = %s
    """, (title, body, question_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Question updated"}), 200

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# 9) Delete a Question (DELETE /questions/<question_id>)
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@discussion_bp.route('/questions/<question_id>', methods=['DELETE'])
def delete_question(question_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM questions WHERE question_id = %s", (question_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Question deleted"}), 200
