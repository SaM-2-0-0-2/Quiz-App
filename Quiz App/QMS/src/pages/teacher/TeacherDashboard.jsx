
import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Nav, Tab, Badge, Alert } from "react-bootstrap"
import { Users, BarChart3, User, BookOpen, Award, TrendingUp, Clock } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { teacherAPI } from "../../services/api"
import StudentManagement from "../../components/teacher/StudentManagement"
import ResultManagement from "../../components/teacher/ResultManagement"
import TeacherProfile from "../../components/teacher/TeacherProfile"

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    results: 0,
    subjects: 0,
    permissions: 0,
  })

  const { user } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [subjectsRes, permissionsRes] = await Promise.all([
        teacherAPI.getSubjects(user.id),
        teacherAPI.getPermissions(user.id),
      ])

      setStats((prev) => ({
        ...prev,
        subjects: subjectsRes.data.length,
        permissions: permissionsRes.data.length,
      }))
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  return (
    <div className="min-vh-100 bg-light">
      <Container fluid className="py-4">
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center mb-3">
              <div
                className="bg-success bg-gradient rounded-circle me-3 d-flex align-items-center justify-content-center"
                style={{ width: "60px", height: "60px" }}
              >
                <User size={24} className="text-white" />
              </div>
              <div>
                <h1 className="display-6 fw-bold text-success mb-1">Teacher Dashboard</h1>
                <p className="text-muted mb-0">
                  Welcome back, <span className="fw-semibold text-success">{user?.name}</span>
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Welcome Alert */}
        <Alert variant="success" className="border-0 rounded-4 mb-4 bg-success bg-opacity-10">
          <div className="d-flex align-items-center">
            <Award size={20} className="text-success me-3" />
            <div>
              <h6 className="mb-1 fw-bold text-success">Ready to manage your classes!</h6>
              <p className="mb-0 text-success">
                Use the tabs below to manage students, add results, and view your profile information.
              </p>
            </div>
          </div>
        </Alert>

        {/* Stats Cards */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <Card className="border-0 shadow-sm rounded-4 h-100 bg-primary bg-gradient text-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="text-white-50 mb-1">My Students</h6>
                    <h2 className="fw-bold mb-0">{stats.students}</h2>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-circle p-2">
                    <Users size={24} />
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <TrendingUp size={16} className="me-2" />
                  <small className="opacity-75">Enrolled students</small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="border-0 shadow-sm rounded-4 h-100 bg-success bg-gradient text-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="text-white-50 mb-1">Results Added</h6>
                    <h2 className="fw-bold mb-0">{stats.results}</h2>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-circle p-2">
                    <BarChart3 size={24} />
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <Award size={16} className="me-2" />
                  <small className="opacity-75">Total results</small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="border-0 shadow-sm rounded-4 h-100 bg-info bg-gradient text-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="text-white-50 mb-1">My Subjects</h6>
                    <h2 className="fw-bold mb-0">{stats.subjects}</h2>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-circle p-2">
                    <BookOpen size={24} />
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <BookOpen size={16} className="me-2" />
                  <small className="opacity-75">Assigned subjects</small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="border-0 shadow-sm rounded-4 h-100 bg-warning bg-gradient text-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="text-white-50 mb-1">Permissions</h6>
                    <h2 className="fw-bold mb-0">{stats.permissions}</h2>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-circle p-2">
                    <User size={24} />
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <Clock size={16} className="me-2" />
                  <small className="opacity-75">Active permissions</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Card className="border-0 shadow-sm rounded-4">
          <Tab.Container defaultActiveKey="students">
            <Card.Header className="bg-white border-0 rounded-top-4 p-4">
              <Nav variant="pills" className="nav-fill">
                <Nav.Item>
                  <Nav.Link eventKey="students" className="rounded-3 fw-semibold">
                    <Users size={18} className="me-2" />
                    Students
                    <Badge bg="primary" className="ms-2">
                      {stats.students}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="results" className="rounded-3 fw-semibold">
                    <BarChart3 size={18} className="me-2" />
                    Results
                    <Badge bg="success" className="ms-2">
                      {stats.results}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="profile" className="rounded-3 fw-semibold">
                    <User size={18} className="me-2" />
                    Profile
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>

            <Card.Body className="p-4">
              <Tab.Content>
                <Tab.Pane eventKey="students">
                  <StudentManagement onUpdate={fetchStats} />
                </Tab.Pane>
                <Tab.Pane eventKey="results">
                  <ResultManagement />
                </Tab.Pane>
                <Tab.Pane eventKey="profile">
                  <TeacherProfile />
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Tab.Container>
        </Card>
      </Container>
    </div>
  )
}

export default TeacherDashboard
