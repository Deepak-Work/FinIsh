// HomePage.jsx
import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { initializeApp } from "firebase/app";
import { setPersistence,browserLocalPersistence, browserSessionPersistence ,getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import SignInPopup  from "./SignIn"; // Import the SignInPopup component
import firebaseConfig from '/Users/dc/Documents/Personal-Code/FinIsh/backend/firebaseConfig.json'

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in local storage
    // This is the default behavior
    console.log("Firebase persistence set");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

function Node({ position, label, onClick }) {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color={label === "User" ? "blue" : "gray"} />
    </mesh>
  );
}

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);

  const checkSession = () => {
    fetch('http://127.0.0.1:5000/check_session', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    })
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          console.log("User is logged in:", data.user);
          setUser(data.user); // Set user state with session data
          setShowSignIn(false); // Hide sign-in popup
        } else {
          console.log("No active session");
          setUser(null);
          setShowSignIn(true); // Show sign-in popup if no session exists
        }
      })
      .catch(error => {
        console.error("Error checking session:", error);
        setUser(null);
        setShowSignIn(true); // Show sign-in popup on error
      });
  };

  const handleLogout = () => {
    fetch('http://127.0.0.1:5000/logout', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    })
      .then(response => {
        if (response.ok) {
          window.location.href = '/'; // Redirect to homepage or login page after logout
        }
      })
      .catch(error => console.error("Error during logout:", error));
  };

  useEffect(() => {
    checkSession();
  }, []);



  const nodes = [
    { label: "Profile", position: [2, 2, 0], link: "/profile" },
    { label: "Projects", position: [-2, 2, 0], link: "/projects" },
    { label: "Contact", position: [2, -2, 0], link: "/contact" },
    { label: "Blog", position: [-2, -2, 0], link: "/blog" },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {user && (
        <button 
          onClick={handleLogout}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      )}
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <Node position={[0, 0, 0]} label="User" onClick={() => {}} />
        {nodes.map((node, index) => (
          <Node
            key={index}
            position={node.position}
            label={node.label}
            onClick={() => window.location.href = node.link}
          />
        ))}
        <OrbitControls />
      </Canvas>
      {showSignIn && <SignInPopup 
    onSignInSuccess={(loggedInUser) => {
      setUser(loggedInUser); // Set user state after successful login
      setShowSignIn(false); // Hide sign-in popup
    }} 
  />}
    </div>
  );
}



