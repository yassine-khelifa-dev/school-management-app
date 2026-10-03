import { NavLink } from "react-router-dom";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

import "./Navbar.css";
import { useUser } from "../contexts/useUser";

export default function Navbar() {
  const { user } = useUser();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `app-navbar__link${isActive ? " app-navbar__link--active" : ""}`;

  return (
    <nav
      className={`app-navbar ${
        user?.user?.role === "admin"
          ? "app-navbar--admin"
          : user?.user?.role === "teacher"
            ? "app-navbar--teacher"
            : ""
      }`}
    >
      <div className="app-navbar__main">
        <div className="app-navbar__inner">
          <div className="app-navbar__brand">
            <span className="app-navbar__mark">
              <SchoolRoundedIcon />
            </span>

            <span className="app-navbar__brand-text">
              <strong>Seven School</strong>
              <small>Academic Management Portal</small>
            </span>
          </div>

          <div className="app-navbar__links">
            {user?.user?.role === "teacher" && (
              <>
                <NavLink to="/teacher/students" className={linkClass}>
                  <PeopleAltOutlinedIcon fontSize="small" />
                  <span>My Students</span>
                </NavLink>

                <NavLink to="/exams" className={linkClass}>
                  <AssignmentOutlinedIcon fontSize="small" />
                  <span>Exams</span>
                </NavLink>
              </>
            )}

            {user?.user?.role === "admin" && (
              <>
                <NavLink to="/students" className={linkClass}>
                  <PeopleAltOutlinedIcon fontSize="small" />
                  <span>Students</span>
                </NavLink>

                <NavLink to="/enrollments" className={linkClass}>
                  <HowToRegOutlinedIcon fontSize="small" />
                  <span>Enrollments</span>
                </NavLink>

                <NavLink to="/exams" className={linkClass}>
                  <AssignmentOutlinedIcon fontSize="small" />
                  <span>Exams</span>
                </NavLink>
              </>
            )}

            {user && (
              <NavLink to="/statistics" className={linkClass}>
                <BarChartRoundedIcon fontSize="small" />
                <span>Statistics</span>
              </NavLink>
            )}
          </div>

          <div className="app-navbar__account">
            <div className="app-navbar__demo-badge">
              <span className="app-navbar__demo-dot" />
              Demo
            </div>

            {user ? (
              <>
                <div
                  className="app-navbar__profile"
                  title={user.user.email}
                >
                  <span className="app-navbar__avatar">
                    <PersonRoundedIcon fontSize="small" />
                  </span>

                  <span className="app-navbar__identity">
                    <strong>
                      {user.user.role === "admin"
                        ? "School Administrator"
                        : "Teacher Portal"}
                    </strong>

                    <small>{user.user.email}</small>
                  </span>
                </div>

                <NavLink
                  to="/logout"
                  className={({ isActive }) =>
                    `${linkClass({ isActive })} app-navbar__logout`
                  }
                >
                  <LogoutOutlinedIcon fontSize="small" />
                  <span>Logout</span>
                </NavLink>
              </>
            ) : (
              <NavLink to="/login" className={linkClass}>
                <LoginOutlinedIcon fontSize="small" />
                <span>Login</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>

      <div className="app-navbar__demo-strip">
        <div className="app-navbar__demo-strip-inner">
          <span>
            Demo environment · Academic data is fictional and provided for
            demonstration purposes only.
          </span>

          <span className="app-navbar__author">
            Designed & developed by Yassine Khelifa
          </span>
        </div>
      </div>
    </nav>
  );
}