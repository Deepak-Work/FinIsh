from flask import Flask, session, redirect, url_for, jsonify, request
from routes.auth import auth_bp
from routes.discussion import discussion_bp
import psycopg2
from config import Config

app = Flask(__name__)

app.config.from_object(Config)

# Function to connect to the Supabase Postgres database
def get_db_connection():
    conn = psycopg2.connect(app.config['DATABASE_URI'])
    return conn

# Register the authentication blueprint
app.register_blueprint(auth_bp)
app.register_blueprint(discussion_bp, url_prefix='/discussion')

@app.route("/")
def index():
    if session.get("user"):
        return f"Hello {session['user']['email']}!<br><a href='/logout'>Logout</a>"
    else:
        return redirect(url_for("auth.login"))

if __name__ == "__main__":
    app.run(debug=True)
