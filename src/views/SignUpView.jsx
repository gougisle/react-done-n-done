import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  FormCheck,
  Alert,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const SignUpView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const navigate = useNavigate();
  const authContext = useAuth();

  const onSignUpAttempt = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const passwordInput = passwordRef.current.value;
    const passwordConfInput = passwordConfirmRef.current.value;
    const emailInput = emailRef.current.value;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{6,}/;

    //Password must include at least: 1 lowercase, 1 uppercase, 1 number
    if (passwordInput !== passwordConfInput) {
      setError("Passwords must match.");
    } else if (
      !passwordRegex.test(passwordInput) ||
      !passwordRegex.test(passwordConfInput)
    ) {
      setError(
        "Password must be contain at least 6 characters with at least 1 lowercase, 1 Uppercase and 1 number."
      );
    } else {
      try {
        const res = await authContext.signup(emailInput, passwordInput);
        toast.success("Great! Successfully created your account.", {});
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setError(
            "Sorry but that email already exists in our system, please try another email address"
          );
        } else {
          toast.error(
            "Something went wrong when trying to register your account, please try again.",
            { theme: "colored" }
          );
          console.error("err message: ", error.code);
        }
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          {" "}
          <Card>
            <Card.Header>
              <h2 className="text-center">Sign Up</h2>
            </Card.Header>

            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={onSignUpAttempt}>
                <Form.Group id="email">
                  <Form.Label> Email</Form.Label>
                  <Form.Control type="email" required ref={emailRef} />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    required
                    ref={passwordRef}
                  />
                </Form.Group>{" "}
                <Form.Group id="password-confirm">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    required
                    ref={passwordConfirmRef}
                  />
                </Form.Group>
                <FormCheck
                  type="checkbox"
                  value={false}
                  label="Show password"
                  onChange={() => {
                    setShowPassword(!showPassword);
                  }}
                ></FormCheck>
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-100 mt-3"
                  variant="primary"
                >
                  {" "}
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Already have an acccount? <a href="/login">Login</a>
          </div>
          {/* <button
            type="button"
            onClick={(e) => {
              authContext.changeName("John");
            }}
          >
            change name
          </button> */}
        </div>
      </Container>
    </>
  );
};

export default SignUpView;
