import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Alert,
  Spinner,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col md={10}>
            <h2 className="text-center text-primary fw-bold mb-4">
              Student Quiz Results
            </h2>
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : results.length === 0 ? (
              <Alert variant="info">No results available.</Alert>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover className="shadow-sm">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Student Username</th>
                      <th>Quiz ID</th>
                      <th>Marks Obtained</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={result.ResultID}>
                        <td>{index + 1}</td>
                        <td>{result.UserName}</td>
                        <td>{result.QuizID}</td>
                        <td>{result.MarksObtained}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Col>
        </Row>
        <div className="text-center">
          <Button
            as={Link}
            to="/"
            variant="outline-success"
            className="w-10 py-2 fw-semibold rounded-3"
          >
            Back
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default StudentResults;
