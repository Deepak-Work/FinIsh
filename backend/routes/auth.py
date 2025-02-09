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
    # Render the login page that includes Firebase client-side JS.
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

@auth_bp.route("/logout")
def logout():
    # Clear the Flask session and the session cookie.
    session.pop("user", None)
    response = make_response(redirect(url_for("auth.login")))
    response.set_cookie("session", "", expires=0)
    return response
