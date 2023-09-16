import React from "react";
import { Container, Spinner } from "react-bootstrap";

export default function LoadingSpinner() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Spinner animation="border" variant="secondary" />
    </Container>
  );
}
