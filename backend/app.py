from flask import Flask, session, redirect, url_for
from routes.auth import auth_bp
from flask_cors import CORS
import secrets
from flask_session import Session
import os

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

# Register the authentication blueprint
app.register_blueprint(auth_bp)

@app.route("/")
def index():
    if session.get("user"):
        return f"Hello {session['user']['email']}!<br><a href='/logout'>Logout</a>"
    else:
        return redirect(url_for("auth.login"))

if __name__ == "__main__":
    app.run(debug=True, port=5000)
