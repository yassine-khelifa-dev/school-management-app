import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import { Logout } from "../components/Logout";
import StudentsPage from "../features/students/pages/StudentsPage";
import EnrollmentPage from "../features/enrollments/pages/EnrollmentPage";

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/enrollments" element={<EnrollmentPage />} />
        <Route path="/logout" element={<Logout />} />
      </Route>
    </Routes>
  );
}
