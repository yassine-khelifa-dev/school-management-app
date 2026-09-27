import { useEffect, useState } from "react";
import { api } from "../api";
import { Navigate, Outlet } from "react-router-dom";
import { LoadingUI } from "../components/ui/LoadingUI";

export default function AuthenticatedRoute() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const checkUser = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 700));
        await api.get("me");
        setStatus("allowed");
      } catch {
        setStatus("unauthenticated");
      }
    };
    checkUser();
  }, []);

  if (status === "loading") {
    return <LoadingUI fullscreen />;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
