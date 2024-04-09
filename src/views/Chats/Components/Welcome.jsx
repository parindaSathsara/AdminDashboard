import React from "react";
import GoogleSignin from "./img/btn.png";
import customer from "./img/Customer.png"
// import { auth } from "../../../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "src/firebase";

const Welcome = () => {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
};
  return (
    <main className="welcome">
      <h2>Welcome to Aahaas Customer Service.</h2>
      <img src={customer} alt="ReactJs logo" width={100} height={100} border-radius="50" />
      <p>Sign in with Google to chat with our Customer Support</p>
      <button className="sign-in">
        <img
          onClick={googleSignIn}
          src={GoogleSignin}
          alt="sign in with google"
          type="button"
        />
      </button>
    </main>
  );
};

export default Welcome;