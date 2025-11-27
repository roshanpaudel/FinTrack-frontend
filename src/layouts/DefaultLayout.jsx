import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

export const DefaultLayout = () => {
  const location = useLocation();
  const hideNav = ["/login", "/signup"].includes(location.pathname);

  const layoutStyle = {
    minHeight: "100vh", // make page full height
    display: "flex",
    flexDirection: "column",
  };

  const mainStyle = {
    flex: 1, // take remaining space so footer sits at bottom
    paddingTop: "1rem",
    paddingBottom: "1rem",
  };

  return (
    <div style={layoutStyle}>
      <Navbar
        bg="light"
        expand="lg"
        className="shadow-sm"
        style={{ backgroundColor: "#FFD59E" }} // optional light orange
        variant="light"
      >
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold">
            Fintrack
          </Navbar.Brand>

          {!hideNav && (
            <>
              <Navbar.Toggle aria-controls="main-navbar" />
              <Navbar.Collapse id="main-navbar">
                <Nav className="ms-auto">
                  <Nav.Link as={NavLink} to="/dashboard">
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/transactions">
                    Transactions
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/profile">
                    Profile
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>

      <Container style={mainStyle}>
        <Outlet />
      </Container>

      <footer className="text-center py-3 bg-white border-top">
        © {new Date().getFullYear()} Fintrack
      </footer>
    </div>
  );
};
