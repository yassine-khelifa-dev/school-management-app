import { NavLink } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function Navbar() {
  const { user } = useUser();

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: "none",
    color: isActive ? "#111827" : "#6b7280",
    fontWeight: isActive ? 700 : 500,
    padding: "8px 12px",
    borderRadius: "8px",
    backgroundColor: isActive ? "#f3f4f6" : "transparent",
    transition: "all 0.2s ease",
  });

  return (
    <nav
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          minHeight: "64px",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: "#111827",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "17px",
            }}
          >
            S
          </div>

          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.3px",
            }}
          >
            Seven School App
          </span>
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {!user && (
            <NavLink to="/login" style={linkStyle}>
              Login
            </NavLink>
          )}

          {user?.user.role === "teacher" && (
            <>
              <NavLink to="/teacher/students" style={linkStyle}>
                My Students
              </NavLink>

              <NavLink to="/exams" style={linkStyle}>
                Exams
              </NavLink>

              <NavLink
                to="/logout"
                style={({ isActive }) => ({
                  ...linkStyle({ isActive }),
                  color: "#dc2626",
                })}
              >
                Logout
              </NavLink>
            </>
          )}

          {user?.user.role === "admin" && (
            <>
              <NavLink to="/students" style={linkStyle}>
                Students
              </NavLink>

              <NavLink to="/enrollments" style={linkStyle}>
                Enrollments
              </NavLink>

              <NavLink to="/exams" style={linkStyle}>
                Exams
              </NavLink>

              <NavLink
                to="/logout"
                style={({ isActive }) => ({
                  ...linkStyle({ isActive }),
                  color: "#dc2626",
                })}
              >
                Logout
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
