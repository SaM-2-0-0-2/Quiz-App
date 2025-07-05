
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { teacherAPI, adminAPI } from "../../services/api"
import { useAuth } from "../../context/AuthContext"
import toast from "react-hot-toast"
import { Button, Modal, Form, Table, Row, Col, Spinner } from "react-bootstrap"
import { Plus, Edit, Trash2 } from "lucide-react"

const ResultManagement = () => {
  const [results, setResults] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingResult, setEditingResult] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { user } = useAuth()

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
  }, [])

  useEffect(() => {
    if (selectedClass) fetchStudents(selectedClass)
  }, [selectedClass])

  useEffect(() => {
    if (selectedStudent) fetchStudentResults(selectedStudent)
  }, [selectedStudent])

  const fetchClasses = async () => {
    try {
      const res = await adminAPI.getClasses()
      setClasses(res.data)
    } catch {
      toast.error("Failed to fetch classes")
    }
  }

  const fetchSubjects = async () => {
    try {
      const res = await teacherAPI.getSubjects(user.id)
      setSubjects(res.data)
    } catch {
      toast.error("Failed to fetch subjects")
    }
  }

  const fetchStudents = async (classId) => {
    try {
      const res = await teacherAPI.getStudentsByClass(classId)
      setStudents(res.data)
    } catch {
      toast.error("Failed to fetch students")
    }
  }

  const fetchStudentResults = async (studentId) => {
    try {
      const res = await teacherAPI.getStudentResults(studentId)
      setResults(res.data)
    } catch {
      toast.error("Failed to fetch results")
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        studentId: selectedStudent,
        teacherId: user.id,
      }

      if (editingResult) {
        await teacherAPI.updateResult(editingResult.id, payload)
        toast.success("Result updated")
      } else {
        await teacherAPI.addResult(payload)
        toast.success("Result added")
      }

      fetchStudentResults(selectedStudent)
      handleCloseModal()
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (result) => {
    setEditingResult(result)
    reset({
      subjectId: result.subject?.id,
      marks: result.marks,
      remarks: result.remarks,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this result?")) return
    try {
      await teacherAPI.deleteResult(id)
      toast.success("Result deleted")
      fetchStudentResults(selectedStudent)
    } catch {
      toast.error("Failed to delete")
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingResult(null)
    reset()
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

  const getGradeColor = (grade) => {
    const map = {
      "A+": "text-success",
      A: "text-success",
      "B+": "text-primary",
      B: "text-primary",
      C: "text-warning",
      D: "text-warning",
      F: "text-danger",
    }
    return map[grade] || "text-secondary"
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Result Management</h4>
        <Button
          disabled={!selectedStudent}
          onClick={() => setShowModal(true)}
          variant="primary"
        >
          <Plus size={18} className="me-2" /> Add Result
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Select Class</Form.Label>
            <Form.Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">-- Select --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Select Student</Form.Label>
            <Form.Select
              value={selectedStudent}
              disabled={!selectedClass}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">-- Select --</option>
              {students.map((stu) => (
                <option key={stu.id} value={stu.id}>
                  {stu.rollNo} - {stu.fullName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {selectedStudent && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
              {/* <th>Remarks</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => {
              const grade = getGrade(res.marks)
              return (
                <tr key={res.id}>
                  <td>{res.subjectName || "N/A"}</td>
                  <td>{res.marks}</td>
                  <td className={getGradeColor(grade)}>{grade}</td>
                  {/* <td>{res.remarks || "-"}</td> */}
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(res)}
                      className="me-2"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(res.studentId)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingResult ? "Edit Result" : "Add Result"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Select {...register("subjectId", { required: "Required" })}>
                <option value="">-- Select Subject --</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </Form.Select>
              {errors.subjectId && <small className="text-danger">{errors.subjectId.message}</small>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Marks</Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={100}
                placeholder="Enter marks"
                {...register("marks", {
                  required: "Required",
                  min: 0,
                  max: 100,
                })}
              />
              {errors.marks && <small className="text-danger">{errors.marks.message}</small>}
            </Form.Group>

            {/* <Form.Group className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control as="textarea" rows={3} {...register("remarks")} />
            </Form.Group> */}

            <div className="text-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : editingResult ? "Update" : "Add"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ResultManagement
