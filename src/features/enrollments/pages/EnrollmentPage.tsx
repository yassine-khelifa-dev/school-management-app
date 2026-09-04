import EnrollmentTable from "../components/EnrollmentTable";
import EnrollmentFilter from "../components/EnrollmentFilter";
import { useEnrollment } from "../hooks/useEnrollment";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import LinkIcon from "@mui/icons-material/Link";
import CreateEnrollmentDialog from "../components/CreateEnrollmentDialog";
import { useState } from "react";
import EditEnrollmentDialog from "../components/EditEnrollmentDialog";
import type { EnrollmentType } from "../types";
import DeleteEnrollmentDialog from "../components/DeleteEnrollmentDialog";

export default function EnrollmentPage() {
  //
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const [selecteEnrollDelete, setSelecteEnrollDelete] =
    useState<EnrollmentType | null>(null);

  const [selecteEnrollEdit, setSelecteEnrollEdit] =
    useState<EnrollmentType | null>(null);

  const handleOpenCreateDialog = (open: boolean) => setOpenCreateDialog(open);

  const {
    enrollmentList,
    academicYers,
    schoolClasses,
    query,
    loading,
    error,
    deleting,
    changePage,
    changeFilter,
    refresh,
    messages,
    handledeleteEnrollment,
  } = useEnrollment();

  const handleEdit = (enroll: EnrollmentType) => {
    setSelecteEnrollEdit(enroll);
    setOpenEditDialog(true);
  };

  const handleDelete = (enroll: EnrollmentType) => {
    setSelecteEnrollDelete(enroll);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selecteEnrollDelete) return;

    const success = await handledeleteEnrollment(selecteEnrollDelete);
    if (success) {
      setOpenDeleteDialog(false);
      setSelecteEnrollDelete(null);
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
        <h1>Enrollments</h1>

        <Button
          variant="contained"
          color="success"
          onClick={() => handleOpenCreateDialog(true)}
        >
          <LinkIcon sx={{ paddingRight: "5px" }} />
          Enrollment
        </Button>
      </div>

      {messages && <Alert severity="info">{messages}</Alert>}

      {openCreateDialog && (
        <CreateEnrollmentDialog
          open={openCreateDialog}
          setOpen={handleOpenCreateDialog}
        />
      )}

      {selecteEnrollEdit && openEditDialog && (
        <EditEnrollmentDialog
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          selecteEnroll={selecteEnrollEdit}
          refresh={refresh}
        />
      )}

      {selecteEnrollDelete && openDeleteDialog && (
        <DeleteEnrollmentDialog
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          selecteEnroll={selecteEnrollDelete}
          confirm={handleDeleteConfirm}
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
      <EnrollmentFilter
        academicYers={academicYers}
        schoolClasses={schoolClasses}
        query={query}
        changeFilter={changeFilter}
      />

      {error && <Alert severity="error">{error.message}</Alert>}

      {enrollmentList?.data.length === 0 && (
        <Alert severity="info">There are no enrollments!</Alert>
      )}

      {enrollmentList?.data.length > 0 && (
        <EnrollmentTable
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleting={deleting}
          enrollments={enrollmentList}
          changePage={changePage}
        />
      )}
    </>
  );
}
