import React, { useState, useEffect } from "react";

// Function to validate email format using a regular expression
const isValidEmail = (email) => {
  const emailPattern =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

export default function SignInPopup({ onSignInSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // To toggle between SignIn and Register
  const [alertMessage, setAlertMessage] = useState(""); // State for dynamic alerts
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // To toggle password visibility
  const [isRetypePasswordVisible, setIsRetypePasswordVisible] = useState(false); // To toggle retype password visibility

  const signInWithGoogle = () => {
    console.log("Attempting to sign in with Google");
    fetch("http://127.0.0.1:5000/login")
      .then((response) => response.json())
      .then((data) => {
        if (data.login_url) {
          console.log(data);
          window.location.href = data.login_url;
        } else {
          console.error("No login URL provided");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleSignIn = () => {
    console.log("Signing in with:", email, password);
    // Add API request to authenticate user
  };

  const handleRegister = () => {
    console.log("Registering with:", fullName, username, email, password, retypePassword);

    // Check if all fields are filled
    if (!fullName || !username || !email || !password || !retypePassword) {
      setAlertMessage("Please fill in all fields.");
      return;
    }

    // Check if email is valid
    if (!isValidEmail(email)) {
      setAlertMessage("Please enter a valid email address.");
      return;
    }

    // Check if passwords match
    if (password !== retypePassword) {
      setAlertMessage("Passwords do not match!");
      return;
    }

    // Clear alert if everything is good
    setAlertMessage("");

    // Add API request to register user
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setAlertMessage(""); // Clear alert when toggling forms
  };

  useEffect(() => {
    const checkSession = () => {
      fetch("http://127.0.0.1:5000/check_session", {
        method: "GET",
        credentials: "include", // Include cookies in the request
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            console.log("User successfully logged in:", data.user);
            onSignInSuccess(data.user); // Notify parent about successful login
          }
        })
        .catch((error) => console.error("Error checking session:", error));
    };

    checkSession(); // Call checkSession when component mounts
  }, [onSignInSuccess]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "300px",
        alignItems: "center", // Center align all the elements horizontally
      }}
    >
      <h2>{isRegistering ? "Register" : "Sign In"}</h2>

      {/* Display Dynamic Alert */}
      {alertMessage && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
            textAlign: "center",
            border: "1px solid #f5c6cb",
            width: "100%",
          }}
        >
          {alertMessage}
        </div>
      )}

      {isRegistering && (
        <>
          {/* Full Name Input */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
            }}
            required
          />

          {/* Username Input */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
            }}
            required
          />
        </>
      )}

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "100%",
        }}
        required
      />

      {/* Password Input */}
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            paddingRight: "10px",
            // paddingRight: "10px", // Add extra padding for the toggle icon
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "100%",
          }}
          required
        />
        <span
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          {isPasswordVisible ? "Hide" : "Show"}
        </span>
      </div>

      {isRegistering && (
        <>
          {/* Retype Password Input */}
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={isRetypePasswordVisible ? "text" : "password"}
              placeholder="Retype Password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              style={{
                padding: "10px",
                paddingRight: "40px", // Add extra padding for the toggle icon
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "100%",
              }}
              required
            />
            <span
              onClick={() => setIsRetypePasswordVisible(!isRetypePasswordVisible)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {isRetypePasswordVisible ? "Hide" : "Show"}
            </span>
          </div>
        </>
      )}

      <button
        onClick={isRegistering ? handleRegister : handleSignIn}
        style={{
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
          width: "100%",
        }}
      >
        {isRegistering ? "Register" : "Sign In"}
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <span
          style={{ cursor: "pointer", color: "#007bff" }}
          onClick={toggleForm}
        >
          {isRegistering
            ? "Already have an account? Sign In"
            : "Don't have an account? Register"}
        </span>
      </div>

      <div style={{ textAlign: "center", margin: "10px 0", color: "#555" }}>
        OR
      </div>

      <button
        onClick={signInWithGoogle}
        style={{
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "#db4437",
          color: "white",
          border: "none",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Sign In with Google
      </button>
    </div>
  );
}
