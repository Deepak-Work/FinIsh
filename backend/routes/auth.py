from flask import Blueprint, redirect, url_for, session, request, jsonify, render_template,make_response
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os
import json
import requests
from services import firebase_service
auth_bp = Blueprint("auth", __name__)

# Load client secrets from JSON file
with open('./secrets.json', 'r') as f:
    client_secrets = json.load(f)

CLIENT_ID = client_secrets['client_id']
CLIENT_SECRET = client_secrets['client_secrets']
TOKEN_URL = "https://oauth2.googleapis.com/token"
USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"

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
    print(redirect_uri)
    auth_url = (
        f'https://accounts.google.com/o/oauth2/v2/auth'
        f'?client_id={CLIENT_ID}'
        f'&response_type=code'
        f'&scope=openid%20email%20profile'
        f'&redirect_uri={redirect_uri}'
    )
    return jsonify({"login_url": auth_url})
    # return render_template("login.html")
    
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

@auth_bp.route("/callback", methods=['GET'])
def callback():
    # Get the authorization code from the query parameters
    code = request.args.get('code')
    if not code:
        return jsonify({"error": "Authorization code not found"}), 400

    # Exchange authorization code for access token
    token_data = {
        'code': code,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'redirect_uri': url_for('auth.callback', _external=True),
        'grant_type': 'authorization_code',
    }
    token_response = requests.post(TOKEN_URL, data=token_data)
    if token_response.status_code != 200:
        return jsonify({"error": "Failed to fetch access token"}), 400

    tokens = token_response.json()
    access_token = tokens.get('access_token')

    # Fetch user info using the access token
    headers = {'Authorization': f'Bearer {access_token}'}
    userinfo_response = requests.get(USERINFO_URL, headers=headers)
    if userinfo_response.status_code != 200:
        return jsonify({"error": "Failed to fetch user info"}), 400

    user_info = userinfo_response.json()

    # Store user info in session
    session['user'] = {
        'email': user_info.get('email'),
        'name': user_info.get('name'),
        'picture': user_info.get('picture'),
    }

    session.modified = True  # Ensure the session is saved

    print("Session after setting:", dict(session))

    # Save session explicitly before redirect
    from flask import g
    g.session = session
    return redirect('http://127.0.0.1:5174/')#jsonify({"message": "Login successful", "user": session['user']})

@auth_bp.route("/check_session", methods=['GET'])
def check_session():
    print("Session data:", dict(session))
    
    if 'user' in session:
        return jsonify({"user": session['user']})
    return jsonify({"user": None}), 401

@auth_bp.route("/logout")
def logout():
    session.pop('user', None)
    return jsonify({"message": "Logged out successfully"})