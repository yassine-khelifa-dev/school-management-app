import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import { Logout } from "../components/Logout";
import StudentsPage from "../features/students/pages/StudentsPage";
import EnrollmentPage from "../features/enrollments/pages/EnrollmentPage";
import ForbiddenPage from "../pages/ForbiddenPage";
import AuthenticatedRoute from "./AuthenticatedRoute";
import ExamsPage from "../features/exams/pages/ExamsPage";
import ExamDetailsPage from "../features/exams/pages/ExamDetailsPage";

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/forbidden" element={<ForbiddenPage />} />

      <Route element={<AuthenticatedRoute />}>
        <Route path="/logout" element={<Logout />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/exams/:id" element={<ExamDetailsPage />} />
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/enrollments" element={<EnrollmentPage />} />
      </Route>

      <Route element={<ProtectedRoute role="teacher" />}>
        <Route path="/teacher/students" element={<StudentsPage />} />
      </Route>
    </Routes>
  );
}
