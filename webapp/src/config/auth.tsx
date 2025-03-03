import { auth, googleProvider } from "./firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";

export const AuthView = () => {

  // Normal Log in code 
  // const [email, setEmail] = useState<string>("");
  // const [password, setPassword] = useState<string>("");

  // const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEmail(e.target.value);
  // };

  // const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setPassword(e.target.value);
  // };

  // const signIn = async () => {
  //   try {
  //     await createUserWithEmailAndPassword(auth, email, password);
  //     console.log("User registered successfully");
  //   } catch (error) {
  //     console.error("Error signing in:", error);
  //   }
  // };

  console.log(auth?.currentUser?.email);

  const [user, setUser] = useState<User | null>(null); // Track auth state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup function to prevent memory leaks
  }, []);

  
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("User registered successfully");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const signOut_= async () => {
    try {
      await signOut(auth);
      console.log("User Signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const loginBtns = () => {
    return auth.currentUser ? (
      <button onClick={signOut_}>Logout</button>
    ) : (
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    );
  };


  const userImage = () => {
    return auth.currentUser ? (
      <img src={auth.currentUser.photoURL} alt="" 
      className="h-10 w-10 rounded-full object-cover"
      />
    ) : (
      <div></div>
    );
  };
  
      
  return (
    <div className="flex gap-2">
      {/* <input className="bg-blue-100"
        placeholder="Email..." 
        onChange={handleEmailChange} 
        type="email"
      />
      <input  className="bg-blue-100"
        placeholder="Password" 
        onChange={handlePasswordChange} 
        type="password"
      />
      <button className="bg-blue-100"
      onClick={signIn}>Sign In</button> */}

      {/* Google Sign in */}

      {userImage()}       
      {loginBtns()}

    </div>
  );
};