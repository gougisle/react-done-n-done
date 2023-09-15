import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeView from "./views/HomeView";
import SignUpView from "./views/SignUpView";
import LoginView from "./views/LoginView";
import TopNavbar from "./components/TopNavbar";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "./App.scss";

//export const AuthContext = React.createContext();

function App() {
  // const [currentUser, setCurrentUser] = useState();

  // function signup(email, password) {
  //   return createUserWithEmailAndPassword(auth, email, password);
  // }

  // const authContextValue = { currentUser, signup };

  return (
    <div className="App">
      <ToastContainer />
      <TopNavbar></TopNavbar>
      <AuthProvider>
        {" "}
        <Router>
          <Routes>
            {" "}
            <Route exact path="/login" Component={LoginView} />
            <Route exact path="/signup" Component={SignUpView} />
            <Route exact path="/" Component={HomeView} />
          </Routes>
        </Router>
      </AuthProvider>{" "}
    </div>
  );
}

export default App;
