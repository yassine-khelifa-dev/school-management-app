import { useEffect, useState } from "react";
import { api } from "../api";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

type Props = {
  role: string;
};

export default function ProtectedRoute({ role }: Props) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const checkUser = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 700));

        const res = await api.get("me");

        const data = res.data;
        const user_role = data?.role;

        console.log("me: ", user_role, "props: ", role);

        if (user_role === role) setStatus("allowed");
        else setStatus("forbidden");
      } catch (error) {
        // console.log('eProtectedRoute:err => ', error)
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setStatus("unauthenticated");
            return;
          }

          if (error.response?.status === 403) {
            setStatus("forbidden");
            return;
          }
        }
        setStatus("network");
      }
    };

    checkUser();
  }, [role]);

  if (status === "loading") {
    console.log("loading");
    return <p>Checking access...</p>;
  }

  if (status === "network") {
    console.log("NetWork erro");
    return <p>Error network...</p>;
  }

  if (status === "unauthenticated") {
    console.log("unauthenticated");

    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    console.log("forbidden");

    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
