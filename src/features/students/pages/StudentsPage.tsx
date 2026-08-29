import type { StudentQueryType, StudentType } from "../types";
import StudentTable from "../components/StudentTable";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import StudentFilter from "../components/StudentFilter";
import { useStudentList } from "../hooks/useStudentList";
import DeleteStudentDialog from "../components/DeleteStudentDialog";
import { useState } from "react";
import Alert from "@mui/material/Alert";

export default function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(
    null,
  );
  const [open, setOpen] = useState(false);

  const {
    students,
    deleteStudent,

    query,
    setQuery,

    errors,

    loading,

    paginate,
  } = useStudentList();

  const handleQuery = (newQuery: StudentQueryType) => {
    setQuery(newQuery);
  };

  const handleDelete = (id: number) => {
    setOpen(true);
    const student = students.find((s) => s.id === id) ?? null;
    setSelectedStudent(student);
  };

  const handleConfirmDel = () => {
    if (!selectedStudent) return;
    deleteStudent(selectedStudent);
    setOpen(false);
  };
  const handleEdit = (id: number) => {
    console.log("handle Edit ", id);
  };

  return (
    <>
      <h1>Student</h1>

      <DeleteStudentDialog
        open={open}
        setOpen={setOpen}
        student={selectedStudent}
        confirm={handleConfirmDel}
      />

      <StudentFilter onQueryChange={handleQuery} value={query} />

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

      {errors && <Alert severity="error">{errors}</Alert>}

      {students.length > 0 && (
        <>
          <StudentTable
            students={students}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onQueryChange={handleQuery}
            query={query}
            paginate={paginate}
          />
        </>
      )}

      {students.length === 0 && !loading && !errors && (
        <span>There are no Students! </span>
      )}
    </>
  );
}
