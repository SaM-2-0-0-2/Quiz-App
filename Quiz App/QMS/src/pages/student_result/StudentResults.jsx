
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Search, FileText, Award, ArrowLeft, TrendingUp, Users } from "lucide-react"
import toast from "react-hot-toast"
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
  Spinner,
  Badge,
  Nav,
  NavItem,
  NavLink,
  ProgressBar,
  Alert,
} from "react-bootstrap"
import { studentAPI } from "../../services/api"
import "./StudentResult.css"

const StudentResult = () => {
  const [results, setResults] = useState([])
  const [classResults, setClassResults] = useState([])
  const [studentInfo, setStudentInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("student")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const studentResponse = await studentAPI.getResults(data.studentId)
      const studentResults = studentResponse.data || []

      setResults(studentResults)

      if (studentResults.length > 0) {
        setStudentInfo({
          name: studentResults[0]?.studentName,
          rollNo: data.studentId,
          className: studentResults[0]?.className,
        })

        if (studentResults[0]?.classId) {
          try {
            const classResponse = await studentAPI.getClassResults(studentResults[0].classId)
            setClassResults(classResponse.data || [])
          } catch (classError) {
            console.warn("Could not load class results:", classError)
            setClassResults([])
          }
        }
      } else {
        toast.info("No results found for this student")
      }
    } catch (error) {
      console.error("Error fetching results:", error)
      toast.error(error.response?.data?.message || "Failed to fetch results")
      setResults([])
      setStudentInfo(null)
      setClassResults([])
    } finally {
      setLoading(false)
    }
  }

  const getGrade = (marks, maxMarks = 100) => {
    if (maxMarks === 0) return "N/A"
    const percentage = (marks / maxMarks) * 100
    if (percentage >= 90) return "A+"
    if (percentage >= 80) return "A"
    if (percentage >= 70) return "B+"
    if (percentage >= 60) return "B"
    if (percentage >= 50) return "C"
    if (percentage >= 40) return "D"
    return "F"
  }

  const getGradeVariant = (grade) => {
    const variants = {
      "A+": "success",
      A: "success",
      "B+": "primary",
      B: "primary",
      C: "warning",
      D: "warning",
      F: "danger",
      "N/A": "secondary",
    }
    return variants[grade] || "secondary"
  }

  const calculateTotalMarks = () => results.reduce((sum, result) => sum + (result.marks || 0), 0)
  const calculateMaxTotalMarks = () => results.reduce((sum, result) => sum + (result.maxMarks || 100), 0)
  const calculatePercentage = () => {
    const maxTotal = calculateMaxTotalMarks()
    return maxTotal > 0 ? ((calculateTotalMarks() / maxTotal) * 100).toFixed(2) : "0.00"
  }

  const resetSearch = () => {
    setResults([])
    setStudentInfo(null)
    setClassResults([])
  }

  return (
    <div className="min-vh-100 bg-light">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xl={10}>
            {/* Header */}
            <div className="text-center mb-5">
              <div
                className="bg-primary bg-gradient rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{ width: "80px", height: "80px" }}
              >
                <Award size={32} className="text-white" />
              </div>
              <h1 className="display-5 fw-bold text-primary mb-2">Student Results Portal</h1>
              <p className="lead text-muted">
                {studentInfo ? `Viewing results for ${studentInfo.name}` : "Enter your student ID to view results"}
              </p>
            </div>

            {/* Search Form */}
            {!studentInfo ? (
              <Card className="shadow-lg border-0 rounded-4 mb-5">
                <Card.Body className="p-5">
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="g-3 align-items-end">
                      <Col md={8}>
                        <Form.Group>
                          <Form.Label className="fw-semibold fs-5">
                            <Search size={20} className="me-2" />
                            Student ID
                          </Form.Label>
                          <Form.Control
                            type="text"
                            size="lg"
                            className="rounded-3"
                            placeholder="Enter your student ID (e.g., 12345)"
                            {...register("studentId", {
                              required: "Student ID is required",
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Please enter a valid numeric ID",
                              },
                            })}
                            isInvalid={!!errors.studentId}
                          />
                          <Form.Control.Feedback type="invalid">{errors.studentId?.message}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-100 py-3 fw-semibold rounded-3"
                          size="lg"
                          variant="primary"
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Searching...
                            </>
                          ) : (
                            <>
                              <Search size={18} className="me-2" />
                              Search Results
                            </>
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            ) : (
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Button
                  variant="outline-secondary"
                  onClick={resetSearch}
                  className="d-flex align-items-center rounded-3"
                >
                  <ArrowLeft size={18} className="me-2" />
                  New Search
                </Button>
                <Nav variant="pills" activeKey={activeTab} onSelect={setActiveTab}>
                  <NavItem>
                    <NavLink eventKey="student" className="rounded-3 fw-semibold">
                      <Award size={16} className="me-2" />
                      My Results
                    </NavLink>
                  </NavItem>
                  {classResults.length > 0 && (
                    <NavItem>
                      <NavLink eventKey="class" className="rounded-3 fw-semibold">
                        <Users size={16} className="me-2" />
                        Class Rankings
                      </NavLink>
                    </NavItem>
                  )}
                </Nav>
              </div>
            )}

            {/* Student Information */}
            {studentInfo && (
              <Card className="shadow-sm border-0 rounded-4 mb-4">
                <Card.Header className="bg-primary bg-gradient text-white rounded-top-4">
                  <h4 className="mb-0 fw-bold">
                    <FileText size={20} className="me-2" />
                    Student Information
                  </h4>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row>
                    <Col md={6}>
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <Award size={20} className="text-primary" />
                        </div>
                        <div>
                          <small className="text-muted">Student Name</small>
                          <h6 className="mb-0 fw-bold">{studentInfo.name}</h6>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                          <FileText size={20} className="text-success" />
                        </div>
                        <div>
                          <small className="text-muted">Roll Number</small>
                          <h6 className="mb-0 fw-bold">{studentInfo.rollNo}</h6>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* Results Display */}
            {activeTab === "student" ? (
              <>
                {/* Student Results Summary */}
                {results.length > 0 && (
                  <Row className="g-4 mb-4">
                    <Col lg={4}>
                      <Card className="h-100 border-0 shadow-sm rounded-4 bg-primary bg-gradient text-white">
                        <Card.Body className="p-4 text-center">
                          <FileText size={32} className="mb-3" />
                          <h3 className="fw-bold mb-1">{results.length}</h3>
                          <p className="mb-0 opacity-75">Total Subjects</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={4}>
                      <Card className="h-100 border-0 shadow-sm rounded-4 bg-success bg-gradient text-white">
                        <Card.Body className="p-4 text-center">
                          <TrendingUp size={32} className="mb-3" />
                          <h3 className="fw-bold mb-1">{calculatePercentage()}%</h3>
                          <p className="mb-0 opacity-75">Overall Percentage</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={4}>
                      <Card className="h-100 border-0 shadow-sm rounded-4 bg-warning bg-gradient text-white">
                        <Card.Body className="p-4 text-center">
                          <Award size={32} className="mb-3" />
                          <h3 className="fw-bold mb-1">{getGrade(calculateTotalMarks(), calculateMaxTotalMarks())}</h3>
                          <p className="mb-0 opacity-75">Overall Grade</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}

                {/* Student Results Table */}
                {results.length > 0 ? (
                  <Card className="shadow-sm border-0 rounded-4">
                    <Card.Header className="bg-light border-0 rounded-top-4">
                      <h5 className="mb-0 fw-bold text-primary">
                        <Award size={20} className="me-2" />
                        Subject-wise Performance
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <Table responsive className="mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th className="border-0 fw-bold text-muted py-3">Subject</th>
                            <th className="border-0 fw-bold text-muted py-3">Marks Obtained</th>
                            <th className="border-0 fw-bold text-muted py-3">Progress</th>
                            <th className="border-0 fw-bold text-muted py-3">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((result, index) => {
                            const percentage = ((result.marks || 0) / (result.maxMarks || 100)) * 100
                            const grade = getGrade(result.marks, result.maxMarks)
                            return (
                              <tr key={result.subjectId || index}>
                                <td className="py-3 fw-semibold">{result.subjectName}</td>
                                <td className="py-3">
                                  <span className="fw-bold">{result.marks || 0}</span>
                                  <span className="text-muted">/{result.maxMarks || 100}</span>
                                </td>
                                <td className="py-3">
                                  <ProgressBar
                                    now={percentage}
                                    variant={getGradeVariant(grade)}
                                    style={{ height: "8px" }}
                                    className="rounded-pill"
                                  />
                                  <small className="text-muted">{percentage.toFixed(1)}%</small>
                                </td>
                                <td className="py-3">
                                  <Badge bg={getGradeVariant(grade)} className="px-3 py-2 rounded-pill fw-semibold">
                                    {grade}
                                  </Badge>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                ) : studentInfo ? (
                  <Alert variant="info" className="text-center py-5 border-0 rounded-4">
                    <FileText size={48} className="text-muted mb-3" />
                    <h4>No Results Available</h4>
                    <p className="mb-0">Your results will appear here once they are published by your teachers.</p>
                  </Alert>
                ) : null}
              </>
            ) : (
              // Class Results would go here - similar styling pattern
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Header className="bg-light border-0 rounded-top-4">
                  <h5 className="mb-0 fw-bold text-primary">
                    <Users size={20} className="me-2" />
                    Class Rankings
                  </h5>
                </Card.Header>
                <Card.Body>
                  <p className="text-muted">Class ranking feature coming soon...</p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default StudentResult
