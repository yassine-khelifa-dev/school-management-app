import { useEffect } from "react";
import { useUser } from "../contexts/useUser";

export default function ForbiddenPage() {
  const { user } = useUser();

  useEffect(() => {
    console.log(user);
  }, []);
  return <h1>403 - Forbidden</h1>;
}
