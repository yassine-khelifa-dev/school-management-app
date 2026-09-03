import EnrollmentTable from "../components/EnrollmentTable";
import EnrollmentFilter from "../components/EnrollmentFilter";
import { useEnrollment } from "../hooks/useEnrollment";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import LinkIcon from "@mui/icons-material/Link";
import CreateEnrollmentDialog from "../components/CreateEnrollmentDialog";
import { useState } from "react";

export default function EnrollmentPage() {
  //
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);

  const handleOpenCreateDialog = (open: boolean) => setOpenCreateDialog(open);

  const {
    enrollmentList,
    academicYers,
    schoolClasses,
    query,
    loading,
    errors,
    changePage,
    changeFilter,
  } = useEnrollment();

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

      <CreateEnrollmentDialog
        open={openCreateDialog}
        setOpen={handleOpenCreateDialog}
      />

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

      {errors && <Alert severity="error">{errors}</Alert>}

      {enrollmentList?.data.length === 0 && (
        <Alert severity="info">There are no enrollments!</Alert>
      )}

      {enrollmentList?.data.length > 0 && (
        <EnrollmentTable enrollments={enrollmentList} changePage={changePage} />
      )}
    </>
  );
}
