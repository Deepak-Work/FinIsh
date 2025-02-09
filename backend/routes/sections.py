from flask import Blueprint, request, jsonify, current_app
import psycopg2


sections_bp = Blueprint('sections', __name__)

def get_db_connection():
    conn = psycopg2.connect(current_app.config['DATABASE_URI'])
    print(conn)
    return conn

# In-memory storage for the last selected video
selected_video = {
    "src": "https://www.youtube.com/embed/3xXUQEvf8v0",  # Default video
    "title": "Financial Terms Explained as Simply as Possible",
    "id": '5e33acdd-143e-468c-946f-2274fad79e76',
    "tag": 'Trading'
}

@sections_bp.route('/set_video', methods=['POST'])
def set_video():
    """
    API endpoint to update the selected video.
    Expected JSON format: { "src": "video_url", "title": "video_title" }
    """
    global selected_video
    data = request.json
    print(data)


    if "src" in data and "title" in data:
        selected_video["src"] = data["src"]
        selected_video["title"] = data["title"]
        selected_video["id"] = data["id"]
        selected_video["tag"] = data["tag"]


        return jsonify({"message": "Video updated successfully"}), 200
    
    return jsonify({"error": "Invalid data"}), 400

@sections_bp.route('/get_video', methods=['GET'])
def get_video():
    """API endpoint to fetch the currently selected video."""
    print("Getting data:", selected_video)
    return jsonify(selected_video)
