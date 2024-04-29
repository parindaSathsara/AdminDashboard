import React from "react";
import GoogleSignin from "./img/btn.png";
// import { auth } from "../../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "src/firebase";

const NavBar = () => {
  const [user] = useAuthState(auth);
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };
  const signOut = () => {
    auth.signOut();
  };

  return (
    <nav className="nav-bar d-flex">
      {user ? (
        <button onClick={signOut} className="sign-out" type="button">
          Sign Out
        </button>
      ) : (
        <button className="sign-in">
          <img
            onClick={googleSignIn}
            src={GoogleSignin}
            alt="sign in with google"
            type="button"
          />
        </button>
      )}


    </nav>
  );
};

export default NavBar;