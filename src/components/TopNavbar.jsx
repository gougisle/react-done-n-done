import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function TopNavbar() {
  const authContext = useAuth();
  const handleLogout = async (e) => {
    if (authContext.currentUser) {
      try {
        await authContext.logout();
        toast.success("Logged Out Successfully!");
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.warning("You are not currently logged in");
    }
  };

  return (
    <>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Done 'n Done</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">My Lists</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">Sign Up</Nav.Link>
              <Nav.Link href="#" onClick={handleLogout}>
                Logout
              </Nav.Link>
              <span className="text-white">
                {authContext.currentUser
                  ? authContext.currentUser.email
                  : "No User "}
              </span>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
