import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./pages/Navbar/Layout";
import Home from "./pages/Home/Home";

import ProtectedRoute from "./components/ProtectedRoute";
import AboutUs from "./pages/Aboutus/AboutUS";
import ContactPage from "./pages/Contactus/ContactPage";
import QuizList from "./pages/QuizList/quizlist";
import StudentLogin from "./pages/students/StudentLogin";
import StudentRegister from "./pages/students/StudentRegister";
import StudentResults from "./pages/ResultPage/StudentResults";
import AdminCreateQuiz from "./pages/AdminCreateQuiz/AdminCreateQuiz";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import QuizStartPage from "./pages/QuizStartPage/QuizStartPage";
import QuizTest from "./pages/QuizTest/QuizTest";
import QuizResult from "./pages/QuizResult/QuizResult";
import CreateQuiz from "./pages/CreateQuiz/CreateQuiz";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import Footer from "./pages/Footer/Footer";
import AdminQuizList from "./pages/AdminQuizList/AdminQuizList";
import ResultsList from "./pages/AdminResultList/ResultsList";

function App() {
  // Get the user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin" || user?.role === "Admin" || user?.role === "ADMIN";

  return (
    <AuthProvider>
      <Router>
        {/* Conditionally render Layout */}
        {isAdmin ? (
          <>         
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/ContactUs" element={<ContactPage />} />
            <Route path="/student_result" element={<StudentResults />} />
            <Route path="/admin_create_quiz" element={<ProtectedRoute role="admin"><AdminCreateQuiz /></ProtectedRoute>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/Dashboard" element={<AdminDashboard />} />
            <Route path="/admin/createQuiz" element={<CreateQuiz />} />
            <Route path="/admin/quizlist" element={<AdminQuizList />} />
            <Route path="/admin/resultList" element={<ResultsList />} />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/admin/Dashboard" replace />} />
          </Routes>
          </>
        ) : (
          <>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/AboutUs" element={<AboutUs />} />
                <Route path="/ContactUs" element={<ContactPage />} />
                <Route path="/student_result" element={<StudentResults />} />
                <Route path="/admin_create_quiz" element={<ProtectedRoute role="admin"><AdminCreateQuiz /></ProtectedRoute>} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/Dashboard" element={<AdminDashboard />} />
                <Route path="/admin/createQuiz" element={<CreateQuiz />} />
                <Route path="/admin/quizlist" element={<AdminQuizList />} />

                <Route path="/student/quiz_start_page/:id" element={<QuizStartPage />} />
                <Route path="/student/quizTest/:quizId" element={<QuizTest />} />
                <Route path="/student/quizTest/quizResult/:id" element={<QuizResult />} />
                <Route path="/Student/login" element={<StudentLogin />} />
                <Route path="/Student/register" element={<StudentRegister />} />
                <Route path="/quizlist" element={<QuizList />} />
                <Route path="/student/dashboard" element={<StudentDashboard />} />

                {/* Redirect unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
            <Footer />
          </>
        )}

      </Router>
    </AuthProvider>
  );
}


export default App;
