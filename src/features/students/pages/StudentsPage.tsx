import type {
  FormStudentInputs,
  StudentQueryType,
  StudentType,
} from "../types";
import StudentTable from "../components/StudentTable";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import StudentFilter from "../components/StudentFilter";
import { useStudentList } from "../hooks/useStudentList";
import DeleteStudentDialog from "../components/DeleteStudentDialog";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import { EditStudentDialog } from "../components/EditStudentDialog";

export default function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(
    null,
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const {
    students,
    deleteStudent,
    editStudent,

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
    setOpenDeleteDialog(true);
    const student = students.find((s) => s.id === id) ?? null;
    setSelectedStudent(student);
  };

  const handleConfirmDel = async () => {
    if (!selectedStudent) return;
    const success = await deleteStudent(selectedStudent);
    if (success) setOpenDeleteDialog(false);
  };

  const handleEdit = (id: number) => {
    setOpenEditDialog(true);
    const student = students.find((s) => s.id === id) ?? null;
    setSelectedStudent(student);
  };

  const handleConfirEdit = async (data: FormStudentInputs) => {
    if (!selectedStudent) return;

    console.log("student edited ! old value", selectedStudent);
    console.log("student edited ! new value", data);
    console.log("**", errors);

    const success = await editStudent(data, selectedStudent);

    if (success) setOpenEditDialog(false);
  };

  return (
    <>
      <h1>Student</h1>

      <DeleteStudentDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        student={selectedStudent}
        confirm={handleConfirmDel}
        backerrors={errors}
      />

      <EditStudentDialog
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        student={selectedStudent}
        confirm={handleConfirEdit}
        backerrors={errors}
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
