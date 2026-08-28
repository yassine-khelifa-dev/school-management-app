import { Routes, Route } from "react-router-dom";
import StudentsPage from "../pages/StudentsPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import { Logout } from "../components/Logout";
export default function AppRoute() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/logout" element={<Logout />} />
      </Route>
    </Routes>
  );
}
