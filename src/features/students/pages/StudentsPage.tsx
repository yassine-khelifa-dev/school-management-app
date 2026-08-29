import { useEffect, useState } from "react";
import { delayTestFetachData, getStudents } from "../services/studentService";
import type { StudentType } from "../types";
import StudentTable from "../components/StudentTable";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrors(null);
      await delayTestFetachData(2000);

      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrors(err.response?.data?.message || "Something went wrong");
      } else {
        setErrors("Something went wrong");
      }
      console.log(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    console.log("handle Delete ", id);
  };
  const handleEdit = (id: number) => {
    console.log("handle Edit ", id);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  return (
    <>
      <h1>Student</h1>

      {loading && (
        <div>
          <span> load students' list...</span>
          <Box sx={{ width: 300 }}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
          </Box>
        </div>
      )}

      {errors && <span style={{ color: "red" }}>{errors}</span>}

      {students.length > 0 && (
        <StudentTable
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {students.length === 0 && !loading && !errors && (
        <span>There are no Students! </span>
      )}
    </>
  );
}
