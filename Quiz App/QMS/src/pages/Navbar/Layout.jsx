import { useAuth } from "../../context/AuthContext";
import { LogOut, User, BookOpen, Home, Info, Puzzle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  Container,
  Navbar,
  Nav,
  Button,
  DropdownButton,
  Dropdown,
  NavDropdown,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import "./Layout.css";

const Layout = ({ children }) => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(); const location = useLocation();
  const toggleUserDropdown = () => setShowUserDropdown(prev => !prev);
  const hideAuthButton = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    if (!user) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }

      const checkUserStillExists = async () => {
        try {
          // adjust this URL to your real user‐fetch endpoint
          await axios.get(`http://localhost:5034/api/User/${user.id}`);
        } catch (err) {
          // on 404 or other errors, assume user was deleted
          console.warn("User no longer exists, logging out…", err);
          logout();
          navigate("/login", { replace: true });
        }
      };

    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    checkUserStillExists();
  }, [user, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const showDropdownOn = [
    "/AboutUs",
    "/ContactUs",
    "/",
    "/admin/Dashboard",
    "/admin/login",
  ];

  const showDropdown = showDropdownOn.includes(location.pathname);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">

      <Navbar
        bg="dark"
        variant="dark"
        style={{
          background:
            "linear-gradient(90deg,rgba(2, 0, 36, 1) 0%, rgba(50, 1, 1, 1) 16%, rgba(52, 9, 121, 1) 100%)",
        }}
        expand="lg"
        className="shadow sticky-top py-3"
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center fw-bold fs-4"
          >
            <div className=" p-1 me-2 d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>
              <img
                src="../../../public/Logo.png"  // or wherever your image is located
                alt="Quiz Icon"
                width={60}
                height={60}
                className="text-primary me-2"
              />

            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar" className="justify-content-end">
            <Nav className="align-items-center gap-3">
              <Nav.Link as={Link} to="/" className="text-white fw-semibold">
                <Home size={16} className="me-1 mb-1" />
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/quizlist"
                className="text-white fw-semibold"
              >
                <Puzzle size={16} className="me-1 mb-1" />
                Quiz-List
              </Nav.Link>



              <Nav.Link
                as={Link}
                to="/AboutUs"
                className="text-white fw-semibold"
              >
                <Info size={16} className="me-1 mb-1" />
                About-Us
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/ContactUs"
                className="text-white fw-semibold"
              >
                <Info size={16} className="me-1 mb-1" />
                Contact-Us
              </Nav.Link>
              {user ? (
                <div ref={dropdownRef} className="position-relative">
                  <div
                    onClick={toggleUserDropdown}
                    style={{ cursor: "pointer" }}
                    className="d-flex align-items-center text-white gap-2"
                  >
                    <div
                      className="bg-white rounded-circle p-1 d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "32px" }}
                    >
                      <User size={16} className="text-primary" />
                    </div>
                    <span className="fw-semibold">Hi, {user.username}</span>
                  </div>

                  {showUserDropdown && (
                    <div
                      className="position-absolute end-0 mt-2 py-2 bg-white rounded shadow"
                      style={{ minWidth: "140px", zIndex: 1050 }}
                    >
                      <Link
                        to="/student/dashboard"
                        className="dropdown-item dropdown-item-hover d-flex align-items-center"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <User size={16} className="me-2 ms-3 text-secondary" />
                        Dashboard
                      </Link>

                      <hr
                        className="my-2"
                        style={{
                          borderTop: "1px solid rgba(0, 0, 0, 0.62)",
                          marginTop: "0.25rem",
                          width: "90%",
                          marginLeft: "auto",
                          marginRight: "auto",
                          marginBottom: "0.25rem"
                        }}
                      />

                      <button
                        className="dropdown-item dropdown-item-hover d-flex align-items-center"
                        onClick={() => {
                          setShowUserDropdown(false);
                          handleLogout();
                        }}
                      >
                        <LogOut size={16} className="me-2 ms-3 text-secondary" />
                        Logout
                      </button>

                    </div>
                  )}
                </div>

              ) : (
                showDropdown && (
                  <Button as={Link} to="/Student/login"

                    title="Login"
                    variant="primary"
                  >
                    Login
                  </Button>
                )
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {!hideAuthButton && (
        <div className="d-flex align-items-center gap-2">
          {login ? (
            <>
              <span className="text-white fw-semibold">Hi, </span>
              {/* <button className="btn btn-outline-light" onClick={handleLogout}>
                Log Out
              </button> */}
            </>
          ) : (
            <Link to="/login" className="btn btn-outline-light">
              Log In
            </Link>
          )}
        </div>
      )}

      <main className="flex-grow-1 py-4">
        <Container fluid>{children}</Container>
      </main>
    </div>
  );
};

export default Layout;

// import { useAuth } from "../../context/AuthContext";
// import { LogOut, User, BookOpen, Home, Info } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Container,
//   Navbar,
//   Nav,
//   Button,
//   DropdownButton,
//   Dropdown,
//   NavDropdown,
//   Badge,
// } from "react-bootstrap";
// import "./Layout.css";

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const showDropdownOn = [
//     "/AboutUs",
//     "/ContactUs",
//     "/",
//     "/admin/Dashboard",
//     "/admin/login",
//   ];

//   const showDropdown = showDropdownOn.includes(location.pathname);

//   return (
//     <div className="bg-light min-vh-100 d-flex flex-column">
//       {/* Updated Navbar */}
//       <Navbar
//         //expand="lg"
//         //className="bg-primary bg-gradient shadow sticky-top py-3"
//         bg="dark"
//         variant="dark"
//         style={{
//           background:
//             "linear-gradient(90deg,rgba(2, 0, 36, 1) 0%, rgba(50, 1, 1, 1) 16%, rgba(52, 9, 121, 1) 100%)",
//         }}
//       >
//         <Container>
//           <Navbar.Brand
//             as={Link}
//             to="/"
//             className="d-flex align-items-center fw-bold fs-4"
//           >
//             <div className="bg-white rounded-circle p-2 me-2">
//               <BookOpen size={24} className="text-primary" />
//             </div>
//             <span className="text-white">Quiz App</span>
//             <Badge bg="light" text="dark" className="ms-2 small">
//               v1.0
//             </Badge>
//           </Navbar.Brand>

//           <Navbar.Toggle aria-controls="main-navbar" />

//           <Navbar.Collapse id="main-navbar" className="justify-content-end">
//             <Nav className="align-items-center gap-3">
//               <Nav.Link as={Link} to="/" className="text-white fw-semibold">
//                 <Home size={16} className="me-1" />
//                 Home
//               </Nav.Link>
//               <Nav.Link
//                 as={Link}
//                 to="/AboutUs"
//                 className="text-white fw-semibold"
//               >
//                 <Info size={16} className="me-1" />
//                 About Us
//               </Nav.Link>
//               <Nav.Link
//                 as={Link}
//                 to="/ContactUs"
//                 className="text-white fw-semibold"
//               >
//                 <Info size={16} className="me-1" />
//                 Contact Us
//               </Nav.Link>
//               {showDropdown && (
//                 <DropdownButton
//                   id="dropdown-basic-button"
//                   title="Login"
//                   variant="primary"
//                 >
//                   <Dropdown.Item href="/admin/login">Admin Login</Dropdown.Item>
//                   <Dropdown.Item href="/Student/login">
//                     Student Login
//                   </Dropdown.Item>
//                   <Dropdown.Item href="/"> LogOut</Dropdown.Item>
//                 </DropdownButton>
//               )}

//               {user && (
//                 <NavDropdown
//                   title={
//                     <span className="d-flex align-items-center text-white">
//                       <div className="bg-white rounded-circle p-1 me-2">
//                         <User size={16} className="text-primary" />
//                       </div>
//                       <span className="fw-semibold">{user.name}</span>
//                       <Badge bg="light" text="dark" className="ms-2 small">
//                         {user.role}
//                       </Badge>
//                     </span>
//                   }
//                   id="user-dropdown"
//                   align="end"
//                 >
//                   <NavDropdown.Item disabled>
//                     <small className="text-muted">Signed in as</small>
//                     <br />
//                     <strong>{user.name}</strong>
//                   </NavDropdown.Item>
//                   <NavDropdown.Divider />
//                   <NavDropdown.Item onClick={handleLogout}>
//                     <LogOut size={16} className="me-2" />
//                     Logout
//                   </NavDropdown.Item>
//                 </NavDropdown>
//               )}
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Main Content */}
//       <main className="flex-grow-1 py-4">
//         <Container fluid>{children}</Container>
//       </main>

//       {/* Footer stays the same (not repeated here for brevity) */}
//     </div>
//   );
// };

// export default Layout;