from flask import Flask, session, redirect, url_for, jsonify, request
from routes.auth import auth_bp
from routes.discussion import discussion_bp
import psycopg2
from flask_jwt_extended import JWTManager
from config import Config
from routes.register import register_bp
from routes.login import login_bp

app = Flask(__name__)

app.config.from_object(Config)
app.config["JWT_SECRET_KEY"] = Config.SECRET_KEY
jwt = JWTManager(app)

# Function to connect to the Supabase Postgres database
def get_db_connection():
    conn = psycopg2.connect(app.config['DATABASE_URI'])
    return conn

# Register the authentication blueprint
app.register_blueprint(auth_bp)
app.register_blueprint(discussion_bp, url_prefix='/discussion')
app.register_blueprint(register_bp, url_prefix="/auth")
app.register_blueprint(login_bp, url_prefix="/auth")

@app.route("/")
def index():
    if session.get("user"):
        return f"Hello {session['user']['email']}!<br><a href='/logout'>Logout</a>"
    else:
        return redirect(url_for("auth.login"))

if __name__ == "__main__":
    app.run(debug=True)
