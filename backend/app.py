from flask import Flask, session, redirect, url_for, jsonify, request
from routes.auth import auth_bp
from flask_cors import CORS
from routes.discussion import discussion_bp
import psycopg2
from flask_jwt_extended import JWTManager
from config import Config
from routes.authen.register import register_bp
from routes.authen.auth_api import auth_api_bp
from flask_session import Session
import os
import secrets
# from routes.register import register_bp
# from routes.login import login_bp
from routes.sections import sections_bp
from routes.explore import explore_bp
from routes.profile import profile_bp
from routes.enrollments import enrollment_bp



from flask_session import Session
import os
import secrets

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Allow cookies for cross-origin requests
app.config['SESSION_COOKIE_SECURE'] = False      # Ensure cookies are sent over HTTPS
app.secret_key = '4e04d5db1ec7a8a26018cac9cb8391e8'

print(app.secret_key)

app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_FILE_DIR"] = "./flask_session"  # Directory to store session files

os.makedirs("./flask_session", exist_ok=True)


Session(app)

app.config.from_object(Config)
app.config["JWT_SECRET_KEY"] = Config.SECRET_KEY
jwt = JWTManager(app)

# Function to connect to the Supabase Postgres database
def get_db_connection():
    conn = psycopg2.connect(app.config['DATABASE_URI'])
    return conn

# Register the authentication blueprint
app.register_blueprint(auth_bp)
app.register_blueprint(register_bp)
app.register_blueprint(discussion_bp, url_prefix='/discussion')
app.register_blueprint(auth_api_bp, url_prefix="/auth")
# app.secret_key = secrets.token_hex(16)
# app.register_blueprint(register_bp, url_prefix="/auth")
# app.register_blueprint(login_bp, url_prefix="/auth")
app.register_blueprint(sections_bp, url_prefix='/sections')
app.register_blueprint(explore_bp, url_prefix='/explore')
app.register_blueprint(profile_bp, url_prefix='/profile')
app.register_blueprint(enrollment_bp, url_prefix='/enrollments')



# app.secret_key = secrets.token_hex(16)
@app.route("/")
def index():
    if session.get("user"):
        return f"Hello {session['user']['email']}!<br><a href='/logout'>Logout</a>"
    else:
        return redirect(url_for("auth.login"))

if __name__ == "__main__":
    app.run(debug=True, port=5000)
