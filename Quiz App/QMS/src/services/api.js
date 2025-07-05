import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for handling 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const adminAPI = {
  login: (credentials) => api.post("/admin/login", credentials),
  getClasses: () => api.get("/admin/classes"),
  addClass: (classData) => api.post("/admin/classes", classData),
  updateClass: (id, classData) => api.put(`/admin/classes/${id}`, classData),
  deleteClass: (id) => api.delete(`/admin/classes/${id}`),
  getSubjects: () => api.get("/admin/subjects"),
  addSubject: (subjectData) => api.post("/admin/subjects", subjectData),
  updateSubject: (id, subjectData) =>
    api.put(`/admin/subjects/${id}`, subjectData),
  deleteSubject: (id) => api.delete(`/admin/subjects/${id}`),
  getPermissions: () => api.get("/admin/permissions"),
  addPermission: (permissionData) =>
    api.post("/admin/permissions", permissionData),
  confirmPermission: (id) => api.put(`/admin/permissions/${id}/confirm`),
  revokePermission: (id) => api.delete(`/admin/permissions/${id}`),
  getClassResults: (classId) => api.get(`/admin/results/class/${classId}`),
  publishResults: (classId) => api.put(`/admin/classes/${classId}/publish`),
  revertResults: (classId) => api.put(`/admin/classes/${classId}/revert`),
  getTeachers: () => api.get("/admin/teachers"),
};

export const teacherAPI = {
  register: (teacherData) => api.post("/teacher/register", teacherData),
  login: (credentials) => api.post("/teacher/login", credentials),
  getStudentsByClass: (classId) =>
    api.get(`/teacher/students/class/${classId}`),
  addStudent: (studentData) => api.post("/teacher/students", studentData),
  updateStudent: (id, studentData) =>
    api.put(`/teacher/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/teacher/students/${id}`),
  assignSubjectToStudent: (studentId, subjectId) =>
    api.post(`/teacher/students/${studentId}/subjects/${subjectId}`),
  removeSubjectFromStudent: (studentId, subjectId) =>
    api.delete(`/teacher/students/${studentId}/subjects/${subjectId}`),
  addResult: (resultData) => api.post("/teacher/results", resultData),
  updateResult: (id, resultData) =>
    api.put(`/teacher/results/${id}`, resultData),
  getStudentResults: (studentId) =>
    api.get(`/teacher/results/student/${studentId}`),
  getProfile: (teacherId) => api.get(`/teacher/profile/${teacherId}`),
  getPermissions: (teacherId) => api.get(`/teacher/permissions/${teacherId}`),
  getSubjects: (teacherId) => api.get(`/teacher/subjects/${teacherId}`),
  deleteResult: (studentId) =>
    api.delete(`/teacher/results/student/${studentId}`),
};

export const studentAPI = {
  getResults: (rollNo) => api.get(`/student/results/${rollNo}`),
  getClassResults: (classId) => api.get(`/student/results/class/${classId}`),
  getProfile: (rollNo) => api.get(`/student/profile/${rollNo}`),
  getSubjects: (rollNo) => api.get(`/student/subjects/${rollNo}`),
};

export default api;
