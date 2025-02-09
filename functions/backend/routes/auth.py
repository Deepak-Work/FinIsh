from flask import Blueprint, redirect, url_for, session, request, jsonify, render_template,make_response
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os
import json
import requests
from ..services import firebase_service
auth_bp = Blueprint("auth", __name__)

# Load client secrets from JSON file
with open('backend/secrets.json', 'r') as f:
    client_secrets = json.load(f)

CLIENT_ID = client_secrets['client_id']
CLIENT_SECRET = client_secrets['client_secrets']

def exchange_code_for_token(authorization_code, redirect_uri):
    token_url = "https://oauth2.googleapis.com/token"
    
    payload = {
        "code": authorization_code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }
    
    response = requests.post(token_url, data=payload)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Token exchange failed: {response.text}")

@auth_bp.route("/login")
def login():
    redirect_uri = url_for('auth.callback', _external=True)
    auth_url = f'https://accounts.google.com/o/oauth2/v2/auth?client_id={CLIENT_ID}&response_type=code&scope=openid%20email%20profile&redirect_uri={redirect_uri}'
    # return jsonify({"login_url": auth_url})
    return render_template("login.html")
@auth_bp.route("/sessionLogin", methods=["POST"])
def session_login():
    # Get the Firebase ID token sent from the client.
    id_token = request.form.get("idToken")
    try:
        # Use our Firebase service to verify the token and create a session cookie.
        decoded_token, session_cookie, expires_in = firebase_service.verify_token_and_create_session(id_token)
        response = make_response("Session login successful")
        response.set_cookie("session", session_cookie, max_age=expires_in.total_seconds(), httponly=True, secure=False)
        # Optionally, store user information in the Flask session.
        session["user"] = {"uid": decoded_token["uid"], "email": decoded_token.get("email")}
        return response
    except Exception as e:
        return f"Failed to create session cookie: {str(e)}", 401

@auth_bp.route("/callback")
def callback():
    code = request.args.get('code')
    if not code:
        return "Error: No code provided", 400

    redirect_uri = url_for('auth.callback', _external=True)
    try:
        # Exchange code for tokens
        token_response = exchange_code_for_token(code, redirect_uri)
        
        # Verify ID token
        idinfo = id_token.verify_oauth2_token(token_response['id_token'], google_requests.Request(), CLIENT_ID)
        
        # Get user info from the ID token
        user_id = idinfo['sub']
        email = idinfo['email']
        
        # Set session
        session["user"] = {"uid": user_id, "email": email}
        
        # Redirect to the React app's homepage
        return redirect('http://localhost:5175/')
    except Exception as e:
        return f'Authentication failed: {str(e)}', 401

@auth_bp.route("/check_session")
def check_session():
    user = session.get("user")
    return jsonify({"user": user})

@auth_bp.route("/logout")
def logout():
    session.pop("user", None)
    return jsonify({"message": "Logged out successfully"})
