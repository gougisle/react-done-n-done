import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import LoadingSpinner from "./components/LoadingSpinner";
import TopNavbar from "./components/TopNavbar";
import { ToastContainer } from "react-toastify";
import "./App.scss";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = React.lazy(() => import("./views/ResetPassword"));
const LoadingSpinner = React.lazy(() => import("./components/LoadingSpinner"));
const TodoListView = React.lazy(() => import("./views/TodoListView"));
const SignUpView = React.lazy(() => import("./views/SignUpView"));
const LoginView = React.lazy(() => import("./views/LoginView"));

function App() {
  return (
    <div className="App">
      <TopNavbar></TopNavbar>{" "}
      <Router>
        <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
          {" "}
          <Routes>
            <Route exact path="/login" Component={LoginView} />
            <Route exact path="/signup" Component={SignUpView} />
            <Route path="/reset-password" Component={ResetPassword}></Route>
            <Route exact path="/" Component={TodoListView} />
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
