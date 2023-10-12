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
        // FIX - This will need to change eventually...
        window.location.href = "/login";
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
          <Navbar.Brand href="/">
            {" "}
            <img
              alt=""
              src="../../../logo192.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Done 'n Done
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {!authContext.currentUser ? (
                <>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/signup">Sign Up</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link href="/">My Lists</Nav.Link>
                  <Nav.Link href="/">Change Password</Nav.Link>
                  <Nav.Link href="#" onClick={handleLogout}>
                    Logout
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
