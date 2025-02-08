from flask import Flask, session, redirect, url_for
from routes.auth import auth_bp

app = Flask(__name__)
app.secret_key = "your-secret-key"  # Replace with your secure secret key

# Register the authentication blueprint
app.register_blueprint(auth_bp)

@app.route("/")
def index():
    if session.get("user"):
        return f"Hello {session['user']['email']}!<br><a href='/logout'>Logout</a>"
    else:
        return redirect(url_for("auth.login"))

if __name__ == "__main__":
    app.run(debug=True)
