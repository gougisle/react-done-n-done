import React, { useRef, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  FormCheck,
  FloatingLabel,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";

const LoginView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const authContext = useAuth();

  const onLoginAttempt = async (e) => {
    e.preventDefault();
    const passwordInput = passwordRef.current.value;
    const emailInput = emailRef.current.value;
    setError("");
    setLoading(true);
    if (auth.currentUser === null)
      try {
        await authContext.login(emailInput, passwordInput);
        toast.success("Logged In Successfully!");
      } catch (error) {
        if (error.code === "auth/invalid-login-credentials") {
          setError(
            "Either the password or email you entered is incorrect, please try again"
          );
        } else if (error.code === "auth/too-many-requests") {
          setError(
            "This account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."
          );
        } else {
          toast.error(
            "Something went wrong when attempting to login, please refresh the page and try again"
          );
          console.error(error.message);
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
              <h2 className="text-center">Login</h2>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={onLoginAttempt}>
                <Form.Group>
                  {" "}
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Email"
                    className="mb-3"
                  >
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      required
                      ref={emailRef}
                    />
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="floatingPassword"
                    label="Password"
                    className="mb-2"
                  >
                    <Form.Control
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      required
                      ref={passwordRef}
                    />
                  </FloatingLabel>
                </Form.Group>

                {/* <Form.Group id="email">
                  <Form.Label> Email</Form.Label>
                  <Form.Control type="email" required ref={emailRef} />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label> Password</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    required
                    ref={passwordRef}
                  />
                </Form.Group> */}
                <FormCheck
                  type="checkbox"
                  value={false}
                  label="Show password"
                  onChange={(e) => {
                    setShowPassword(!showPassword);
                  }}
                ></FormCheck>
                <Button disabled={loading} type="submit" className="w-100 mt-3">
                  {" "}
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Don't have an account yet? <a href="/signup">Sign Up</a>
          </div>
        </div>
      </Container>
    </>
  );
};

export default LoginView;
