import React, { useEffect, useState } from "react";
import { Container, Card, Button, Table, Row, Col, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setProfile({
        id: userData.id, 
        username: userData.username,
        email: userData.email || "student@example.com",
      });

      // Fetch results from backend
      fetchUserResults(userData.username);
    } else {
      navigate("/Student/login");
    }
}, [navigate]);

const fetchUserResults = async (username) => {
  try {
    const response = await axios.get(`http://localhost:5034/api/Results/user/${username}`);
    if (response.data) {
      // Mapping API response to existing table format
      const formattedResults = response.data.map((item) => ({
        id: item.resultID,
        quizTitle: item.quizName,
        totalMarks: item.totalMarks,
        marksObtained: item.marksObtained,
      }));
      setResults(formattedResults);
    }
  } catch (error) {
    console.error(error);
  }
};


  const confirmDeleteAccount = () => {
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!profile?.id) {
      toast.error("User ID missing, cannot delete account.");
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5034/api/user/${profile.id}`);
      localStorage.removeItem("user");
      toast.success("Account deleted successfully!");
      navigate("/Student/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Student Dashboard</h2>

      <Card className="mb-4 shadow-sm">
        <Card.Header as="h5" className="bg-primary text-white">
          Profile Details
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <p><strong>Username:</strong> {profile?.username}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
            </Col>
            <Col className="d-flex justify-content-end align-items-start">
              <Button variant="danger" onClick={confirmDeleteAccount} className="mt-2">
                Delete Account
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Header as="h5" className="bg-success text-white">
          Results
        </Card.Header>
        <Card.Body>
          {results?.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Quiz Title</th>
                  <th>Total Marks</th>
                  <th>Marks Obtained</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={result.id || index}>
                    <td>{index + 1}</td>
                    <td>{result.quizTitle}</td>
                    <td>{result.totalMarks}</td>
                    <td>{result.marksObtained}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">No results available.</p>
          )}
        </Card.Body>
      </Card>

      <div className="text-center">
        <Button variant="secondary" onClick={() => navigate("/")}>
          Back
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete your account? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed} disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentDashboard;
