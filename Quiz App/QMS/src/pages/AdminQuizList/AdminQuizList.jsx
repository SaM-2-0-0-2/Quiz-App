import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Spinner, Navbar, Container, Nav } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5034/api/Quiz");

      const formattedQuizzes = response.data.map((q) => ({
        quizId: q.quizID,
        quizName: q.quizTitle,
        totalMarks: q.totalMarks,
      }));

      setQuizzes(formattedQuizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (row) => {
    setSelectedQuizId(row.quizId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5034/api/Quiz/${selectedQuizId}`);
      setQuizzes(quizzes.filter((q) => q.quizId !== selectedQuizId));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");

  };
  return (
    <>
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
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Admin Quiz List</h2>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Quiz ID</th>
                <th>Quiz Name</th>
                <th>Total Marks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, index) => (
                <tr key={index}>
                  <td>{quiz.quizId}</td>
                  <td>{quiz.quizName}</td>
                  <td>{quiz.totalMarks}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(quiz)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete quiz with ID <b>{selectedQuizId}</b>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default AdminQuizList;
