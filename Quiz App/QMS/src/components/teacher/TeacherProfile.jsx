
import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { teacherAPI } from "../../services/api"
import toast from "react-hot-toast"
import { Spinner, Card, Row, Col, Badge, Alert, Container } from "react-bootstrap"
import { User, Phone, Shield, Award, BookOpen, Clock } from "lucide-react"

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      fetchProfileData()
    }
  }, [user])

  const fetchProfileData = async () => {
    try {
      const [profileRes, subjectsRes, permissionsRes] = await Promise.all([
        teacherAPI.getProfile(user.id),
        teacherAPI.getSubjects(user.id),
        teacherAPI.getPermissions(user.id),
      ])

      setProfile(profileRes.data)
      setSubjects(subjectsRes.data)
      setPermissions(permissionsRes.data)
    } catch (error) {
      console.error("Error fetching profile data:", error)
      toast.error("Failed to fetch profile data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const variantMap = {
      PENDING: "warning",
      CONFIRMED: "success",
      REVOKED: "danger",
    }
    return <Badge bg={variantMap[status]}>{status}</Badge>
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="text-center mb-5">
        <div
          className="bg-success bg-gradient rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
          style={{ width: "80px", height: "80px" }}
        >
          <User size={32} className="text-white" />
        </div>
        <h2 className="fw-bold text-success">Teacher Profile</h2>
        <p className="text-muted">Manage your profile information and view assigned subjects</p>
      </div>

      {/* Profile Information */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Header className="bg-success bg-gradient text-white rounded-top-4">
          <h5 className="mb-0 fw-bold">
            <User size={20} className="me-2" />
            Personal Information
          </h5>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="g-4">
            <Col md={6}>
              <div className="d-flex align-items-center p-3 bg-light rounded-3">
                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <small className="text-muted d-block">Full Name</small>
                  <h6 className="mb-0 fw-bold">{profile?.name || "N/A"}</h6>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="d-flex align-items-center p-3 bg-light rounded-3">
                <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                  <Shield size={20} className="text-success" />
                </div>
                <div>
                  <small className="text-muted d-block">Username</small>
                  <h6 className="mb-0 fw-bold">{profile?.username || "N/A"}</h6>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="d-flex align-items-center p-3 bg-light rounded-3">
                <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                  <Phone size={20} className="text-info" />
                </div>
                <div>
                  <small className="text-muted d-block">Mobile Number</small>
                  <h6 className="mb-0 fw-bold">{profile?.mobile || "Not provided"}</h6>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="d-flex align-items-center p-3 bg-light rounded-3">
                <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                  <Award size={20} className="text-warning" />
                </div>
                <div>
                  <small className="text-muted d-block">Teacher ID</small>
                  <h6 className="mb-0 fw-bold">#{profile?.id || "N/A"}</h6>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Account Status */}
      <Alert variant="success" className="border-0 rounded-4 mb-4 bg-success bg-opacity-10">
        <div className="d-flex align-items-center">
          <Shield size={20} className="text-success me-3" />
          <div>
            <h6 className="mb-1 fw-bold text-success">Account Status: Active</h6>
            <p className="mb-0 text-success">Your teacher account is verified and active.</p>
          </div>
        </div>
      </Alert>

      {/* Quick Stats */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 bg-primary bg-gradient text-white h-100">
            <Card.Body className="p-4 text-center">
              <BookOpen size={32} className="mb-3" />
              <h3 className="fw-bold mb-1">{subjects.length}</h3>
              <p className="mb-0 opacity-75">Assigned Subjects</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 bg-success bg-gradient text-white h-100">
            <Card.Body className="p-4 text-center">
              <Shield size={32} className="mb-3" />
              <h3 className="fw-bold mb-1">{permissions.length}</h3>
              <p className="mb-0 opacity-75">Active Permissions</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 bg-info bg-gradient text-white h-100">
            <Card.Body className="p-4 text-center">
              <Clock size={32} className="mb-3" />
              <h3 className="fw-bold mb-1">Active</h3>
              <p className="mb-0 opacity-75">Account Status</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default TeacherProfile
