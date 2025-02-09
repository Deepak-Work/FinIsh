import { useContext } from "react";
import { AuthOptions } from "../authentication/AuthOptions";
import SignInPopup from "./SignIn";

export default function Login() {
    return(
        <SignInPopup 
            onSignInSuccess={(loggedInUser) => {
              setUser(loggedInUser); // Set user state after successful login
              setShowSignIn(false); // Hide sign-in popup
            }}
            isRegistering={false} 
          />
    );
}