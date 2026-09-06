import { NavLink } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function Navbar() {
  const { user } = useUser();
  return (
    <>
      <nav>
        {!user && (
          <NavLink
            style={({ isActive }) => ({
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "blue" : "black",
            })}
            to="/login"
          >
            Login
          </NavLink>
        )}

        {user?.user.role === "teacher" && (
          <>
            <NavLink
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "blue" : "black",
              })}
              to="/teacher/students"
            >
              My Students
            </NavLink>
            {" | "}
            <NavLink
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "blue" : "black",
              })}
              to="/logout"
            >
              Logout
            </NavLink>
          </>
        )}

        {user?.user.role === "admin" && (
          <>
            <NavLink
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "blue" : "black",
              })}
              to="/students"
            >
              Students
            </NavLink>

            {" | "}
            <NavLink
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "blue" : "black",
              })}
              to="/enrollments"
            >
              Enrollments
            </NavLink>
            {" | "}
            <NavLink
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "blue" : "black",
              })}
              to="/logout"
            >
              Logout
            </NavLink>
          </>
        )}
      </nav>
    </>
  );
}
