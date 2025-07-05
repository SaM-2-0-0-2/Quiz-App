import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  Linkedin,
  Github,
  Twitter,
  ArrowUpCircle,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer text-light py-5">
      <Container>
        <Row className="mb-4">
          {/* Column 1: About */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Quiz App</h5>
            <p className="text-secondary">
              A modern platform to test your knowledge, track progress, and
              learn interactively with quizzes. Build skills in a fun and
              engaging way!
            </p>

            <div className="d-flex gap-3 mt-3">
              <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </Col>

          {/* Column 2: Quick Links */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="footer-link">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/quizlist" className="footer-link">
                  Quizzes
                </a>
              </li>
              <li className="mb-2">
                <a href="/AboutUs" className="footer-link">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="/ContactUs" className="footer-link">
                  Contact
                </a>
              </li>
            </ul>
          </Col>

          {/* Column 3: Our Team */}
          <Col md={4}>
            <h5 className="fw-bold mb-3">Our Team</h5>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <Linkedin size={18} className="me-2 footer-icon" />
                <a
                  href="https://linkedin.com/in/maheshwarbagal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Maheshwar Bagal
                </a>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <Linkedin size={18} className="me-2 footer-icon" />
                <a
                  href="https://linkedin.com/in/member2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Shriram Sabade
                </a>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <Linkedin size={18} className="me-2 footer-icon" />
                <a
                  href="https://linkedin.com/in/member3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Amey Sonawane
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="border-secondary" />

        {/* Footer Bottom */}
        <Row className="align-items-center">
          <Col md={6}>
            <p className="mb-0 text-muted small">
              © {new Date().getFullYear()} Quiz App. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end mt-3 mt-md-0">
            <Button
              variant="outline-light"
              size="sm"
              onClick={scrollToTop}
              className="d-inline-flex align-items-center"
            >
              <ArrowUpCircle size={18} className="me-1" />
              Back to Top
            </Button>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
