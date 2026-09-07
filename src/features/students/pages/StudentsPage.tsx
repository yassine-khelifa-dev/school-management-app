import type {
  FormStudentInputs,
  InputsCreateStudentValues,
  StudentQueryType,
  StudentType,
} from "../types";
import StudentTable from "../components/StudentTable";
import StudentFilter from "../components/StudentFilter";
import { useStudentList } from "../hooks/useStudentList";
import DeleteStudentDialog from "../components/DeleteStudentDialog";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import { EditStudentDialog } from "../components/EditStudentDialog";
import { Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CreateStudentDialog from "../components/CreateStudentDialog";
import { LoadingUI } from "../../../components/ui/LoadingUI";
import useStudentPolicy from "../permissions";

export default function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(
    null,
  );
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const {
    students,
    storeStudent,
    deleteStudent,
    editStudent,

    query,
    setQuery,

    error,
    messages,

    loading,

    paginate,
  } = useStudentList();

  const { canAdd } = useStudentPolicy();

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
    console.log("**", error.message);

    const success = await editStudent(data, selectedStudent);

    if (success) {
      setOpenEditDialog(false);
    }
  };

  const handleCreate = async (data: InputsCreateStudentValues) => {
    console.log("parant :", data);

    const success = await storeStudent(data);

    if (success) setOpenCreateDialog(false);

    return success;
  };

  const handleClickOpenCreateDialog = () => setOpenCreateDialog(true);

  

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Student</h1>

        {canAdd && (
          <Button
            variant="contained"
            color="success"
            onClick={handleClickOpenCreateDialog}
          >
            <AddBoxIcon sx={{ paddingRight: "2px" }} /> Student
          </Button>
        )}
      </div>

     

      <CreateStudentDialog
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        confirm={handleCreate}
        backerrors={error}
      />

      <DeleteStudentDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        student={selectedStudent}
        confirm={handleConfirmDel}
        backerrors={error}
      />
      <EditStudentDialog
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        student={selectedStudent}
        confirm={handleConfirEdit}
        backerrors={error}
      />

      <div
        style={{
          padding: "5px 0px",
        }}
      >
        {error && <Alert severity="error">{error.message}</Alert>}
        {messages && <Alert severity="info">{messages}</Alert>}
      </div>

      <StudentFilter onQueryChange={handleQuery} value={query} />

      {loading && <LoadingUI />}

      {students?.length > 0 && (
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
      {students?.length === 0 && !loading && !error && (
        <span>There are no Students! </span>
      )}
    </>
  );
}
