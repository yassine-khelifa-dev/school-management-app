import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import loginService from "../services/auth";
import type { LoginType } from "../types/user";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [credi, setCredi] = useState<LoginType>({
    email: "sydnie33@example.com",
    password: "password",
  });

  useEffect(() => {
    if (user) navigate("/students");
  }, [user, navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    const user = await loginService(credi);
    // console.log(user);

    // save:
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);

    navigate("/students");
  }

  return (
    <>
      <h1>Login page </h1>
      <div>
        <form onSubmit={handleLogin}>
          <TextField
            sx={{
              marginRight: "20px",
            }}
            required
            id="tf-email"
            label="Email"
            type="email"
            placeholder="example@email.com"
            value={credi.email}
            onChange={(e) => setCredi({ ...credi, email: e.target.value })}
          />
          <TextField
            sx={{
              marginRight: "10px",
            }}
            id="tf-pass"
            type="password"
            required
            label="Password"
            placeholder="******"
            value={credi.password}
            onChange={(e) => setCredi({ ...credi, password: e.target.value })}
          />
          <Button type="submit" variant="contained">
            Log in
          </Button>
        </form>
      </div>
    </>
  );
}
