import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

//create a context that we can use throughout the App
const AuthContext = React.createContext();

//exporting a provider that will wrap our app allowing child componnets to access
//values from within this context

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({ id: 1 });

  //this function will execute a firebase method to register a new user, and return a Promise
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    //this method automatically fires whenever the user state changes (i.e. create, login, logout, etc.)
    //We place it within a useEffect with empty dependency array to ensure it only runs once
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, signup, logout, login };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
