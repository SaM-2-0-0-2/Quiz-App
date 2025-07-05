

import { useState, useEffect } from "react"
import { adminAPI } from "../../services/api"
import toast from "react-hot-toast"
import { Eye, Upload, RotateCcw } from "lucide-react"
import {
  Button,
  Form,
  Table,
  Spinner,
  Badge,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap"

const ResultManagement = () => {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await adminAPI.getClasses()
      console.log("Fetched classes:", response.data)
      setClasses(response.data)
    } catch (error) {
      toast.error("Failed to fetch classes")
    }
  }

  const fetchResults = async (classId) => {
    if (!classId) return

    setLoading(true)
    try {
      const response = await adminAPI.getClassResults(classId)
      setResults(response.data)
    } catch (error) {
      toast.error("Failed to fetch results")
    } finally {
      setLoading(false)
    }
  }

  const handlePublishResults = async (classId) => {
    if (window.confirm("Are you sure you want to publish results for this class?")) {
      try {
        await adminAPI.publishResults(classId)
        toast.success("Results published successfully")
        fetchResults(classId)
      } catch (error) {
        toast.error("Failed to publish results")
      }
    }
  }

  const handleRevertResults = async (classId) => {
    if (window.confirm("Are you sure you want to revert published results for this class?")) {
      try {
        await adminAPI.revertResults(classId)
        toast.success("Results reverted successfully")
        fetchResults(classId)
      } catch (error) {
        toast.error("Failed to revert results")
      }
    }
  }

  const handleClassChange = (classId) => {
    setSelectedClass(classId)
    if (classId) {
      fetchResults(classId)
    } else {
      setResults([])
    }
  }

  const getGrade = (marks) => {
    if (marks >= 90) return "A+"
    if (marks >= 80) return "A"
    if (marks >= 70) return "B+"
    if (marks >= 60) return "B"
    if (marks >= 50) return "C"
    if (marks >= 40) return "D"
    return "F"
  }

  const getGradeVariant = (grade) => {
    const variants = {
      "A+": "success",
      A: "success",
      "B+": "primary",
      B: "primary",
      C: "warning",
      D: "info",
      F: "danger",
    }
    return variants[grade] || "secondary"
  }

  return (
    <Container className="my-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2>Result Management</h2>
        </Col>
        <Col className="text-end">
          {selectedClass && (
            <>
              <Button
                variant="primary"
                className="me-2"
                onClick={() => handlePublishResults(selectedClass)}
              >
                <Upload className="me-1" size={16} />
                Publish Results
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleRevertResults(selectedClass)}
              >
                <RotateCcw className="me-1" size={16} />
                Revert Results
              </Button>
            </>
          )}
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Form.Group as={Row} controlId="selectClass" className="align-items-center">
            <Form.Label column sm={3} md={2}>
              Select Class:
            </Form.Label>
            <Col sm={9} md={4}>
              <Form.Select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
              >
                <option value="">Choose a class</option>
                {classes.length === 0 ? (
                  <option disabled>No classes available</option>
                ) : (
                  classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </option>
                  ))
                )}
              </Form.Select>
            </Col>
          </Form.Group>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : results.length > 0 ? (
        <Card>
          <Card.Body className="p-0">
            <Table striped bordered hover responsive className="mb-0">
  <thead className="table-light">
    <tr>
      <th>Roll No</th>
      <th>Student Name</th>
      <th>Subject</th>
      <th>Marks</th>
 
    </tr>
  </thead>
  <tbody>
    {results.map((result) => {
      const grade = getGrade(result.marks)
      return (
        <tr key={result.id}>
          <td>{result.rollNo}</td>
          <td>{result.studentName}</td> 
          <td>{result.subjectName}</td> 
          <td>{result.marks}</td>
          <td>
            <Badge bg={getGradeVariant(grade)}>{grade}</Badge>
          </td>
         
        </tr>
      )
    })}
  </tbody>
</Table>
          </Card.Body>
        </Card>
      ) : selectedClass ? (
        <Card>
          <Card.Body className="text-center py-5">
            <Eye className="mb-3 text-muted" size={48} />
            <p className="text-muted">No results found for this class</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body className="text-center py-5">
            <Eye className="mb-3 text-muted" size={48} />
            <p className="text-muted">Select a class to view results</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  )
}

export default ResultManagement
