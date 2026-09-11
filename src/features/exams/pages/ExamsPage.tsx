import { Alert, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useExam from "../hooks/useExam";
import ExamTable from "../components/ExamTable";
import ExamFilter from "../components/ExamFilter";
import DeleteExamDialog from "../components/DeleteExamDialog";
import { useState } from "react";
import type { ExamType } from "../types";
import CheckIcon from "@mui/icons-material/Check";

export default function ExamsPage() {
  const {
    examList,
    handleDeleteExam,
    message,
    changePage,
    query,
    loading,
    error,
    changeFilter,
  } = useExam();

  const [examSelected, setExamSelected] = useState<ExamType | null>(null);

  const [openDeleteExamDialog, setOpenDeleteExamDialog] =
    useState<boolean>(false);

  const handleOndelete = (exam: ExamType) => {
    setExamSelected(exam);
    setOpenDeleteExamDialog(true);
  };

  const handleConfirmDeleteDialog = async () => {
    if (!examSelected) return;
    const success = await handleDeleteExam(examSelected);
    if (success) setOpenDeleteExamDialog(false);
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

        <Button
          variant="contained"
          color="success"
          //  onClick={handleClickOpenCreateDialog}
        >
          <AddIcon sx={{ paddingRight: "2px" }} /> Exam
        </Button>
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

      {examSelected && (
        <DeleteExamDialog
          open={openDeleteExamDialog}
          setClose={setOpenDeleteExamDialog}
          exam={examSelected}
          handleConfirm={handleConfirmDeleteDialog}
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
      />
    </>
  );
}
