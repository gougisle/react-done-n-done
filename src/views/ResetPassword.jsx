import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  FloatingLabel,
} from "react-bootstrap";

import { useAuth } from "../contexts/AuthContext";

const ResetPassword = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();

  const { resetPassword } = useAuth();

  const onPasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await resetPassword(emailRef.current.value);
      setMessage(
        "Email sent! Please check your inbox for further instructions on reseting your password"
      );
    } catch (err) {
      if (err.code === "auth/invalid-email") {
        setError("Sorry, we have no record of that email.");
      } else {
        setError("Sorry, could not reset your password.");
        console.error(err);
      }
    }
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
              <h2 className="text-center">Password Reset</h2>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form onSubmit={onPasswordReset}>
                <Form.Group>
                  {" "}
                  <FloatingLabel
                    controlId="floatingEmail"
                    label="Enter the email on your account"
                    className="mb-3"
                  >
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      required
                      ref={emailRef}
                    />
                  </FloatingLabel>
                </Form.Group>

                <Button disabled={loading} type="submit" className="w-100">
                  {" "}
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            <a href="/login">Back to Log In</a>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ResetPassword;
