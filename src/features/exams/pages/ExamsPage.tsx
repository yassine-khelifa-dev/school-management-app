import { Alert, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExamTable from "../components/ExamTable";
import ExamFilter from "../components/ExamFilter";
import DeleteExamDialog from "../components/DeleteExamDialog";
import { useState } from "react";
import type { ExamType, FormExam } from "../types";
import CheckIcon from "@mui/icons-material/Check";
import EditExamDialog from "../components/EditExamDialog";
import CreateExamDialog from "../components/CreateExamDialog";
import { useExamPolicy } from "../permissions";
import useExamList from "../hooks/useExamList";
import useExamActions from "../hooks/useExamActions";

export default function ExamsPage() {
  const { canCreate } = useExamPolicy();
  const list = useExamList();
  const actions = useExamActions();

  const [examSelected, setExamSelected] = useState<ExamType | null>(null);

  const [openDeleteExamDialog, setOpenDeleteExamDialog] =
    useState<boolean>(false);

  const [openEditExamDialog, setOpenEditExamDialog] = useState<boolean>(false);
  const [openCreateExamDialog, setOpenCreateExamDialog] =
    useState<boolean>(false);

  const handleOpenCreate = () => {
    actions.clearError();
    setOpenCreateExamDialog(true);
  };

  const handleCreate = async (data: FormExam) => {
    if (!openCreateExamDialog) return false;
    console.log("handleCreate", data);
    const success = await actions.create(data);

    if (success) {
      list.changePage(1);
    }

    return success;
  };

  const handleOnEdit = (exam: ExamType) => {
    actions.clearError();
    setExamSelected(exam);
    setOpenEditExamDialog(true);
  };

  const handleConfirmEdit = async (data: FormExam) => {
    if (!(examSelected && openEditExamDialog)) return false;
    const success = await actions.edit(examSelected, data);
    if (success === true) {
      setExamSelected(null);
      list.refresh();
    }
    return success;
  };

  const handleOndelete = (exam: ExamType) => {
    actions.clearError();
    setExamSelected(exam);
    setOpenDeleteExamDialog(true);
  };

  const handleConfirmDeleteDialog = async () => {
    if (!(examSelected && openDeleteExamDialog)) return;
    const success = await actions.del(examSelected);
    if (success) {
      setExamSelected(null);
      setOpenDeleteExamDialog(false);
      if (list.examList?.data.length === 1 && list.query.page > 1) {
        list.changePage(list.query.page - 1);
      } else {
        list.refresh();
      }
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
            onClick={handleOpenCreate}
            disabled={actions.loading}
          >
            {actions.loading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <AddIcon sx={{ paddingRight: "2px" }} /> Exam
              </>
            )}
          </Button>
        )}
      </div>

      {list.error && (
        <div style={{ margin: "10px 0px" }}>
          <Alert severity="error">{list.error.message}</Alert>
        </div>
      )}

      {actions.message && (
        <div style={{ margin: "px 0px" }}>
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            {actions.message}
          </Alert>
        </div>
      )}

      <ExamFilter query={list.query} changeFilter={list.changeFilter} />

      {examSelected && openDeleteExamDialog && (
        <DeleteExamDialog
          open={openDeleteExamDialog}
          setClose={setOpenDeleteExamDialog}
          exam={examSelected}
          handleConfirm={handleConfirmDeleteDialog}
          error={actions.error?.message}
          loading={actions.loading}
        />
      )}

      {examSelected && openEditExamDialog && (
        <EditExamDialog
          exam={examSelected}
          open={openEditExamDialog}
          setClose={setOpenEditExamDialog}
          confirmEdit={handleConfirmEdit}
          error={actions.error?.message}
        />
      )}

      {openCreateExamDialog && (
        <CreateExamDialog
          open={openCreateExamDialog}
          setClose={setOpenCreateExamDialog}
          confirmCreate={handleCreate}
          error={actions.error?.message}
        />
      )}

      {list.loading && (
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
        examList={list.examList}
        changePage={list.changePage}
        onDelete={handleOndelete}
        onEdit={handleOnEdit}
      />
    </>
  );
}
