import React, { useState, useEffect } from "react";


export default function SignInPopup({ onSignInSuccess }) {

  const signInWithGoogle = () => {
    console.log("Attempting to sign in with Google");
    fetch('http://127.0.0.1:5000/login')
      .then(response => response.json())
      .then(data => {
        if (data.login_url) {
            // onSignInSuccess()
            console.log(data)
            window.location.href = data.login_url;
        } else {
          console.error('No login URL provided');
        }
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    const checkSession = () => {
        fetch('http://127.0.0.1:5000/check_session', {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
          })
        .then(response => response.json())
        .then(data => {
          if (data.user) {
            console.log("User successfully logged in:", data.user);
            onSignInSuccess(data.user); // Notify parent about successful login
          }
        })
        .catch(error => console.error("Error checking session:", error));
    };

    checkSession(); // Call checkSession when component mounts
  }, [onSignInSuccess]);

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <h2>Sign In</h2>
      <button onClick={signInWithGoogle}>Sign In with Google</button>
    </div>
  );
}
