import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { FaLinkedin, FaGithub, FaInstagram, FaYoutube } from "react-icons/fa";
import { Code, Users, Database } from "lucide-react";
import "./AboutUs.css";

import mahesh from "./../mahesh.jpg";
import Amey from "../../../public/Amey.jpeg";
import shriram from "../../../public/Shriram Narendra Sabade .jpg"
const AboutUs = () => {
  const teamMembers = [
    {
      name: "MAHESHWAR VILAS BAGAL",
      role: "FRONTEND DEVELOPER",
      image: mahesh,
      description:
        "Passionate frontend developer specializing in React.js and modern web technologies.",
      skills: ["React.js", "Bootstrap", "UI/UX "],
      social: {
        linkedin: "",
        github: "",
        instagram: "",
        youtube: "",
      },
      icon: Code,
      color: "primary",
    },
    {
      name: "Amey Sonawane",
      role: "BACKEND DEVELOPER",
      image: Amey,

      description:
        "Expert backend developer focused on server-side architecture and API development.",
      skills: [".NET", "REST APIs", "MS SQL SERVER", "Entity Framework"],
      social: {
        linkedin: " https://www.linkedin.com/in/maheshwar-bagal-629099247/",
        github: "",
        instagram: "",
      },
      icon: Users,
      color: "success",
    },
    {
      name: "Shriram Sabade",
      role: "BACKEND DEVELOPER",
      image: shriram,
      description:
        "Expert backend developer focused on server-side architecture, database designing and API development.",
      skills: [".NET", "REST APIs", "MS SQL SERVER", "Entity Framework"],
      social: {
        linkedin: "",
        github: "",
        instagram: "#",
      },
      icon: Database,
      color: "info",
    },
  ];

  const ProfileImage = ({ member }) => {
    if (member.image) {
      return (
        <img
          src={member.image || "/placeholder.svg"}
          alt={member.name}
          className="profile-photo"
          style={{
            width: "150px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "50%",
            border: `4px solid var(--bs-${member.color})`,
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        />
      );
    }

    // Fallback placeholder with icon
    const IconComponent = member.icon;
    return (
      <div
        className={`profile-placeholder bg-${member.color} bg-gradient d-flex align-items-center justify-content-center`}
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          border: `4px solid var(--bs-${member.color})`,
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <IconComponent size={48} className="text-white" />
      </div>
    );
  };

  return (
    <div className="about-us-page min-vh-100 bg-light">
      {/* Hero Section */}
      <section className="py-5 bg-primary bg-gradient text-white">
        <Container>
          <Row className="text-center">
            <Col>
              {/* <div
                className="bg-white bg-opacity-20 rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center"
                style={{ width: "100px", height: "100px" }}
              >
                <Users size={40} className="text-white" />
              </div> */}
              <h1 className="display-4 fw-bold mb-3">Meet Our Amazing Team</h1>
              <p
                className="lead mx-auto opacity-75"
                style={{ maxWidth: "800px" }}
              >
                We're a passionate team dedicated to building amazing
                experiences. Our diverse skills come together to create
                something truly special.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <Container>
          <Row className="g-4 justify-content-center">
            {teamMembers.map((member, index) => (
              <Col lg={4} md={6} key={index}>
                <Card className="team-card h-100 border-0 shadow-lg rounded-4 overflow-hidden">
                  <Card.Body className="p-5 text-center">
                    {/* Profile Photo */}
                    <div className="mb-4">
                      <ProfileImage member={member} />
                    </div>

                    {/* Member Info */}
                    <h4 className="fw-bold mb-2">{member.name}</h4>
                    <Badge bg={member.color} className="mb-3 px-3 py-2 fs-6">
                      {member.role}
                    </Badge>

                    <p className="text-muted mb-4">{member.description}</p>

                    {/* Skills */}
                    <div className="mb-4">
                      <h6 className="fw-semibold mb-3 text-muted">SKILLS</h6>
                      <div className="d-flex flex-wrap justify-content-center gap-2">
                        {member.skills.map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            bg="light"
                            text="dark"
                            className="px-3 py-2"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="social-links d-flex justify-content-center gap-3">
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          className="text-primary fs-4 social-link"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="LinkedIn"
                        >
                          <FaLinkedin />
                        </a>
                      )}
                      {member.social.github && (
                        <a
                          href={member.social.github}
                          className="text-dark fs-4 social-link"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="GitHub"
                        >
                          <FaGithub />
                        </a>
                      )}
                      {member.social.instagram &&
                        member.social.instagram !== "#" && (
                          <a
                            href={member.social.instagram}
                            className="text-danger fs-4 social-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Instagram"
                          >
                            <FaInstagram />
                          </a>
                        )}
                      {member.social.youtube && (
                        <a
                          href={member.social.youtube}
                          className="text-danger fs-4 social-link"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="YouTube"
                        >
                          <FaYoutube />
                        </a>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Project Info Section */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold text-primary mb-3">
                About This Project
              </h2>
              <p className="lead text-muted">Quiz App</p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={4} md={6}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4 text-center">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <Code size={24} className="text-primary" />
                  </div>
                  <h5 className="fw-bold mb-3">Modern Technology</h5>
                  <p className="text-muted">
                    Built with React.js, Bootstrap, and modern web technologies
                    for optimal performance.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={6}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4 text-center">
                  <div
                    className="bg-success bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <Users size={24} className="text-success" />
                  </div>
                  <h5 className="fw-bold mb-3">User-Centric Design</h5>
                  <p className="text-muted">
                    Designed with administrators, teachers, and students in mind
                    for intuitive workflows.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={6}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4 text-center">
                  <div
                    className="bg-info bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <Database size={24} className="text-info" />
                  </div>
                  <h5 className="fw-bold mb-3">Secure & Reliable</h5>
                  <p className="text-muted">
                    Robust database design and secure authentication ensure data
                    safety.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;
