import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Navbar,
  Nav,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminProfile, setAdminProfile] = useState({ name: "", email: "" });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    if (!window.location.href.includes("refreshed=true")) {
      setLoading(true); 
      setTimeout(() => {
        const separator = window.location.href.includes("?") ? "&" : "?";
        window.location.href = window.location.href + separator + "refreshed=true";
      }, 50); 
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setProfile({
          id: userData.id,
          username: userData.username,
          email: userData.email || "student@example.com",
        });
      } else {
        navigate("/Student/login");
      }
      setLoading(false); 
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");

  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">

      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="shadow sticky-top"
      >
        <Container>
          <Navbar.Brand
            onClick={() => navigate("/admin/Dashboard")}
            style={{ cursor: "pointer" }}
          >
            Admin Portal
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/admin/resultList")}>
                Results
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/admin/quizlist")}>
                Quizzes
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/admin/Dashboard")}>
                Dashboard
              </Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Main Content */}
      <Container className="flex-grow-1 py-4">
        <h2 className="text-center mb-4">Admin Dashboard</h2>

        <Card className="mb-4 shadow">
          <Card.Body>
            <h5>Profile</h5>
            <hr />
            <p>
              <strong>Name:</strong> {profile?.username}
            </p>
            <p>
              <strong>Email:</strong> {profile?.email}
            </p>
          </Card.Body>
        </Card>

        <Row className="text-center mb-4">
          <Col md={4} className="mb-3">
            <Button
              variant="primary"
              size="lg"
              className="w-100"
              onClick={() => navigate("/admin/quizlist")}
            >
              Manage Quizzes
            </Button>
          </Col>
          <Col md={4} className="mb-3">
            <Button
              variant="success"
              size="lg"
              className="w-100"
              onClick={() => navigate("/admin/resultList")}
            >
              Manage Results
            </Button>
          </Col>
          <Col md={4} className="mb-3">
            <Button
              variant="warning"
              size="lg"
              className="w-100"
              onClick={() => navigate("/admin/createQuiz")}
            >
              Create New Quiz
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Sticky Footer */}
      <footer className="bg-dark text-light text-center py-3 mt-auto">
        Copyright &copy; QuizApp @2025
      </footer>
    </div>
  );
};

export default AdminDashboard;
