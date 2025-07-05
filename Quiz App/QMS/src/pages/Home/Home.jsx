import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BarChart3,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  Star,
} from "lucide-react";
import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!window.location.href.includes("refreshed=true")) {
      setTimeout(() => {
        const separator = window.location.href.includes("?") ? "&" : "?";
        window.location.href = window.location.href + separator + "refreshed=true";
      }, 500); 
    } else {
      setLoading(false);
    }
  }, []);

  const handleViewResults = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.username) {
      navigate("/student/dashboard");
    } else {
      navigate("/Student/login", { state: { redirectTo: "/student/dashboard" } });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="hero-content">
                <Badge bg="primary" className="mb-3 px-3 py-2 fs-6">
                  <Star size={16} className="me-2" />
                  Modern Quiz Management 
                </Badge>
                <h1 className="display-3 fw-bold text-white mb-4">
                  Welcome to Quizz App
                </h1>
                <p className="lead text-white-50 mb-4 fs-5">
                  The Quiz App is an interactive platform that tests users’ knowledge through multiple-choice questions. It provides
                  instant feedback and tracks scores to enhance learning in a fun and engaging way.
                </p>
                <div className="d-flex flex-column flex-md-row gap-3">
                  <Button
                    as={Link}
                    to="/quizlist"
                    variant="light"
                    size="lg"
                    className="px-4 py-3 fw-semibold"
                  >
                    <BarChart3 size={20} className="me-2" />
                    View Quiz
                  </Button>

                  <Button
                    variant="outline-light"
                    size="lg"
                    className="px-4 py-3 fw-semibold"
                    onClick={handleViewResults}
                  >
                    <GraduationCap size={20} className="me-2" />
                    Quiz Result
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div className="hero-image text-center">
                <div className="floating-card"></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold text-primary mb-3">
                Why Choose Our System?
              </h2>
              <p className="lead text-muted">
                Built with modern technology for enhanced user experience
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={3} md={6}>
              <div className="text-center">
                <div
                  className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: "70px", height: "70px" }}
                >
                  <Clock size={28} className="text-primary" />
                </div>
                <h5 className="fw-bold mb-2">Real-time Updates</h5>
                <p className="text-muted small">
                  Instant notifications and real-time result publishing for immediate access to academic information.
                </p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="text-center">
                <div
                  className="bg-success bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: "70px", height: "70px" }}
                >
                  <CheckCircle size={28} className="text-success" />
                </div>
                <h5 className="fw-bold mb-2">Secure & Reliable</h5>
                <p className="text-muted small">
                  Advanced security measures and reliable data management to protect sensitive academic information.
                </p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="text-center">
                <div
                  className="bg-info bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: "70px", height: "70px" }}
                >
                  <BookOpen size={28} className="text-info" />
                </div>
                <h5 className="fw-bold mb-2">Easy Management</h5>
                <p className="text-muted small">
                  Intuitive interface design that makes academic management simple and efficient for all users.
                </p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="text-center">
                <div
                  className="bg-warning bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: "70px", height: "70px" }}
                >
                  <Award size={28} className="text-warning" />
                </div>
                <h5 className="fw-bold mb-2">Performance Analytics</h5>
                <p className="text-muted small">
                  Comprehensive analytics and reporting tools to track and improve academic performance.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
