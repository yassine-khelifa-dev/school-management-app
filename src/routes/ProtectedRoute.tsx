import { useEffect, useState } from "react";
import { api } from "../api";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const checkUser = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 700));

        const res = await api.get("me");

        const data = await res.data;
        const role = data?.role;

        if (role === "admin") setStatus("allowed");
        else setStatus("forbidden");
      } catch (error) {
        if (error.response?.status === 401) {
          console.log("message: Unauthenticated.");

          setStatus("unauthenticated");
        }
        if (error.response?.status === 403) {
          setStatus("forbidden");
          return;
        }
      }
    };

    checkUser();
  }, []);

  if (status === "loading") {
    return <p>Checking access...</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
