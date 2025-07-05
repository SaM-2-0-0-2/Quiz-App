import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Navbar, Container, Nav } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResultsList = () => {
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get("http://localhost:5034/api/Results/all-distinct");
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const handleDeleteClick = (row) => {
    setSelectedResultId(row.resultID);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5034/api/Results/${selectedResultId}`);
      setResults(results.filter((r) => r.resultID !== selectedResultId));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting result:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow sticky-top">
        <Container>
          <Navbar.Brand onClick={() => navigate("/admin/Dashboard")} style={{ cursor: "pointer" }}>
            Admin Portal
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/admin/resultList")}>Results</Nav.Link>
              <Nav.Link onClick={() => navigate("/admin/quizlist")}>Quizzes</Nav.Link>
              <Nav.Link onClick={() => navigate("/admin/Dashboard")}>Dashboard</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container mt-5">
        <h2 className="mb-4 text-center">All Results</h2>

        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Result ID</th>
              <th>Username</th>
              <th>Quiz Name</th>
              <th>Marks Obtained</th>
              <th>Total Marks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{result.resultID}</td>
                <td>{result.userName}</td>
                <td>{result.quizName}</td>
                <td>{result.marksObtained}</td>
                <td>{result.totalMarks}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteClick(result)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Delete Confirmation Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete result with Result ID{" "}
            <b>{selectedResultId}</b>?
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

export default ResultsList;
