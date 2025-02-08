import datetime
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

# Initialize the Firebase Admin SDK with your service account credentials.
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

def verify_token_and_create_session(id_token):
    """
    Verifies the Firebase ID token and creates a session cookie.
    Returns the decoded token, session cookie, and expiration timedelta.
    """
    expires_in = datetime.timedelta(days=5)  # Session cookie is valid for 5 days
    decoded_token = firebase_auth.verify_id_token(id_token)
    session_cookie = firebase_auth.create_session_cookie(id_token, expires_in=expires_in)
    return decoded_token, session_cookie, expires_in
