import { Alert, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useExam from "../hooks/useExam";
import ExamTable from "../components/ExamTable";
import ExamFilter from "../components/ExamFilter";
import DeleteExamDialog from "../components/DeleteExamDialog";
import { useState } from "react";
import type { ExamType, FormExam } from "../types";
import CheckIcon from "@mui/icons-material/Check";
import EditExamDialog from "../components/EditExamDialog";
import CreateExamDialog from "../components/CreateExamDialog";
import { useExamPolicy } from "../permissions";

export default function ExamsPage() {
  const { canCreate } = useExamPolicy();

  const {
    examList,
    handleDeleteExam,
    message,
    changePage,
    query,
    loading,
    error,
    changeFilter,
    handleEditExam,
    handleCreateExam,
  } = useExam();

  const [examSelected, setExamSelected] = useState<ExamType | null>(null);

  const [openDeleteExamDialog, setOpenDeleteExamDialog] =
    useState<boolean>(false);

  const [openEditExamDialog, setOpenEditExamDialog] = useState<boolean>(false);
  const [openCreateExamDialog, setOpenCreateExamDialog] =
    useState<boolean>(false);

  const handleCreate = async (data: FormExam) => {
    if (!openCreateExamDialog) return false;
    console.log("handleCreate", data);
    const res = await handleCreateExam(data);
    return res;
  };

  const handleOnEdit = (exam: ExamType) => {
    setExamSelected(exam);
    setOpenEditExamDialog(true);
  };

  const handleConfirmEdit = async (data: FormExam) => {
    if (!(examSelected && openEditExamDialog)) return false;
    const res = await handleEditExam(examSelected, data);
    if (res === true) setExamSelected(null);

    return res;
  };

  const handleOndelete = (exam: ExamType) => {
    setExamSelected(exam);
    setOpenDeleteExamDialog(true);
  };

  const handleConfirmDeleteDialog = async () => {
    if (!(examSelected && openDeleteExamDialog)) return;
    const success = await handleDeleteExam(examSelected);
    if (success) {
      setExamSelected(null);
      setOpenDeleteExamDialog(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Exams</h1>

        {canCreate && (
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpenCreateExamDialog(true)}
          >
            <AddIcon sx={{ paddingRight: "2px" }} /> Exam
          </Button>
        )}
      </div>

      {error && (
        <div style={{ margin: "10px 0px" }}>
          <Alert severity="error">{error.message}</Alert>
        </div>
      )}

      {message && (
        <div style={{ margin: "px 0px" }}>
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            {message}
          </Alert>
        </div>
      )}

      <ExamFilter query={query} changeFilter={changeFilter} />

      {examSelected && openDeleteExamDialog && (
        <DeleteExamDialog
          open={openDeleteExamDialog}
          setClose={setOpenDeleteExamDialog}
          exam={examSelected}
          handleConfirm={handleConfirmDeleteDialog}
          error={error?.message}
        />
      )}

      {examSelected && openEditExamDialog && (
        <EditExamDialog
          exam={examSelected}
          open={openEditExamDialog}
          setClose={setOpenEditExamDialog}
          confirmEdit={handleConfirmEdit}
          error={error?.message}
        />
      )}

      {openCreateExamDialog && (
        <CreateExamDialog
          open={openCreateExamDialog}
          setClose={setOpenCreateExamDialog}
          confirmCreate={handleCreate}
          error={error?.message}
        />
      )}

      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            background: "rgba(255,255,255,0.5)",
          }}
        >
          <CircularProgress />
        </div>
      )}

      <ExamTable
        examList={examList}
        changePage={changePage}
        onDelete={handleOndelete}
        onEdit={handleOnEdit}
      />
    </>
  );
}
