import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";

export default function StudentsPage() {

  const {user} = useUser()

  useEffect(() => {

    console.log("hi context user-provider: ",user)

  },[])
 
  return (
    <>
      <h1>Student</h1>
    </>
  );
}
