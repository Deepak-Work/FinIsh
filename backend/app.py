from flask import Flask, session, redirect, url_for
from routes.auth import auth_bp
import secrets

app = Flask(__name__)

# Register the authentication blueprint
app.register_blueprint(auth_bp)
app.secret_key = secrets.token_hex(16)
@app.route("/")
def index():
    if session.get("user"):
        return f"Hello {session['user']['email']}!<br><a href='/logout'>Logout</a>"
    else:
        return redirect(url_for("auth.login"))

if __name__ == "__main__":
    app.run(debug=True)
