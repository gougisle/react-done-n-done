import React, { useRef } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";

const LoginView = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const onSignUpSubmit = () => {
    if (emailRef.current.value === "2@2") {
      alert("ERROR: Email or Password is incorrect, Try Again!!!");
    } else {
      alert(
        JSON.stringify({
          email: emailRef.current.value,
          password: passwordRef.current.value,
        })
      );
    }
  };
  return (
    <>
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        {" "}
        <div className="w-100" style={{ maxWidth: "400px" }}>
          {" "}
          <Card>
            <Card.Header>
              <h2 className="text-center">Login</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={onSignUpSubmit}>
                <Form.Group id="email">
                  <Form.Label> Email</Form.Label>
                  <Form.Control type="email" required ref={emailRef} />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label> Password</Form.Label>
                  <Form.Control type="password" required ref={passwordRef} />
                </Form.Group>
                <Button type="submit" className="w-100 mt-3">
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
