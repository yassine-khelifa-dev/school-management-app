import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import loginService from "../services/auth";
import type { LoginType, UserType } from "../types/user";
import { useNavigate } from "react-router-dom";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import "../styles/LoginPage.css";
import { useUser } from "../contexts/useUser";
import Alert from "@mui/material/Alert";
import useApiError from "../hooks/useApiError";

export default function LoginPage() {
  const navigate = useNavigate();
  const { error, clearError, handleError } = useApiError();
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUser();
  const [credi, setCredi] = useState<LoginType>({
    email: "admin@northstar-school.test",
    password: "password",
  });

  const redUser = (user: UserType) => {
    if (user?.user?.role === "admin") navigate("/students");
    if (user?.user?.role === "teacher") navigate("/teacher/students");
  };

  useEffect(() => {
    if (user?.user?.role === "admin") navigate("/students");
    if (user?.user?.role === "teacher") navigate("/teacher/students");
  }, [user, navigate]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      clearError();
      setLoading(true);

      const user = await loginService(credi);

      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      redUser(user);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="login-page">
      <section className="login-story" aria-label="About Seven School">
        <div className="login-brand">
          <span className="login-brand__mark">
            <SchoolRoundedIcon fontSize="medium" />
          </span>
          <span>
            <span className="login-brand__name">Seven School</span>
            <span className="login-brand__label">Academic Portal</span>
          </span>
        </div>

        <div className="login-story__content">
          <div className="login-eyebrow">Learn. Grow. Succeed.</div>
          <h1>
            Everything your school needs, <span>in one place.</span>
          </h1>
          <p className="login-story__lead">
            A focused workspace for educators and administrators to support
            every student throughout their academic journey.
          </p>
        </div>

        <div className="login-trust" aria-label="Platform highlights">
          <span>
            <i aria-hidden="true" />
            Secure access
          </span>
          <span>
            <i aria-hidden="true" />
            Built for education
          </span>
        </div>
      </section>

      <section className="login-access">
        <div className="login-access__inner">
          <header className="login-access__header">
            <h2>Welcome back</h2>
            <p>Enter your school credentials to access your workspace.</p>
          </header>

          <form className="login-form" onSubmit={handleLogin}>
            {error && <Alert severity="error">{error.message}</Alert>}
            <div>
              <label className="login-form__label" htmlFor="tf-email">
                Email address
              </label>
              <TextField
                required
                fullWidth
                id="tf-email"
                type="email"
                placeholder="name@school.edu"
                value={credi.email}
                slotProps={{ htmlInput: { "aria-label": "Email address" } }}
                onChange={(e) =>
                  setCredi({
                    ...credi,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="login-form__label" htmlFor="tf-pass">
                Password
              </label>
              <TextField
                fullWidth
                id="tf-pass"
                type="password"
                required
                placeholder="Enter your password"
                value={credi.password}
                slotProps={{ htmlInput: { "aria-label": "Password" } }}
                onChange={(e) =>
                  setCredi({
                    ...credi,
                    password: e.target.value,
                  })
                }
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ mt: 0.75, minHeight: 54, fontSize: "0.95rem" }}
            >
              {loading ? "Signing in..." : "Sign in to your account"}
            </Button>
          </form>

          <footer className="login-form__footer">
            <span>
              <LockOutlinedIcon sx={{ fontSize: 15 }} />
              Protected school access
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
}
