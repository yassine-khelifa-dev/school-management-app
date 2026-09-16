import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import loginService from "../services/auth";
import type { LoginType, UserType } from "../types/user";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [credi, setCredi] = useState<LoginType>({
    email: "sydnie33@example.com",
    password: "password",
  });

  const redUser = (user: UserType) => {
    if (user.user.role === "admin") navigate("/students");
    if (user.user.role === "teacher") navigate("/teacher/students");
  };

  useEffect(() => {
    if (user?.user.role === "admin") navigate("/students");
    if (user?.user.role === "teacher") navigate("/teacher/students");
  }, [user, navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    const user = await loginService(credi);
    //console.log("hi I am ..",user.user.role);

    // save:
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
    redUser(user);
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 65px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Welcome back
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#6b7280",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            Sign in to access your school dashboard.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <TextField
            required
            fullWidth
            id="tf-email"
            label="Email"
            type="email"
            placeholder="example@email.com"
            value={credi.email}
            onChange={(e) =>
              setCredi({
                ...credi,
                email: e.target.value,
              })
            }
          />

          <TextField
            fullWidth
            id="tf-pass"
            type="password"
            required
            label="Password"
            placeholder="******"
            value={credi.password}
            onChange={(e) =>
              setCredi({
                ...credi,
                password: e.target.value,
              })
            }
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              py: 1.3,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "15px",
              borderRadius: 2,
            }}
          >
            Log in
          </Button>
        </form>

        <p
          style={{
            marginTop: "24px",
            marginBottom: 0,
            textAlign: "center",
            color: "#9ca3af",
            fontSize: "13px",
          }}
        >
          School Management System
        </p>
      </div>
    </div>
  );
}
