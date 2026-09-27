import { NavLink } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import "./Navbar.css";

export default function Navbar() {
  const { user } = useUser();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `app-navbar__link${isActive ? " app-navbar__link--active" : ""}`;

  return (
    <nav className="app-navbar">
      <div className="app-navbar__inner">
        <div className="app-navbar__brand">
          <span className="app-navbar__mark"><SchoolRoundedIcon fontSize="small" /></span>
          <span>
            <strong>Seven School</strong>
            <small>Academic portal</small>
          </span>
        </div>

        <div className="app-navbar__links">
          {user?.user?.role === "teacher" && (
            <>
              <NavLink to="/teacher/students" className={linkClass}>
                <PeopleAltOutlinedIcon fontSize="small" /> My Students
              </NavLink>

              <NavLink to="/exams" className={linkClass}>
                <AssignmentOutlinedIcon fontSize="small" /> Exams
              </NavLink>

            </>
          )}

          {user?.user?.role === "admin" && (
            <>
              <NavLink to="/students" className={linkClass}>
                <PeopleAltOutlinedIcon fontSize="small" /> Students
              </NavLink>

              <NavLink to="/enrollments" className={linkClass}>
                <HowToRegOutlinedIcon fontSize="small" /> Enrollments
              </NavLink>

              <NavLink to="/exams" className={linkClass}>
                <AssignmentOutlinedIcon fontSize="small" /> Exams
              </NavLink>

            </>
          )}
        </div>

        <div className="app-navbar__account">
          {user ? (
            <>
              <div className="app-navbar__profile" title={user.user.email}>
                <span className="app-navbar__avatar">
                  <PersonRoundedIcon fontSize="small" />
                </span>
                <span className="app-navbar__identity">
                  <strong>{user.user.role}</strong>
                  <small>{user.user.email}</small>
                </span>
              </div>

              <NavLink
                to="/logout"
                className={({ isActive }) =>
                  `${linkClass({ isActive })} app-navbar__logout`
                }
              >
                <LogoutOutlinedIcon fontSize="small" /> Logout
              </NavLink>
            </>
          ) : (
            <NavLink to="/login" className={linkClass}>
              <LoginOutlinedIcon fontSize="small" /> Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
