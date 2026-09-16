import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export function Logout() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  useEffect(() => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  },[setUser, navigate]);

  return null;
}
