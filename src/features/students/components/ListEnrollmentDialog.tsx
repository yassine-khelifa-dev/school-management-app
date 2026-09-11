import { Fragment, useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import type { StudentType } from "../types";
import type { EnrollmentType } from "../../enrollments/types";
import moment from "moment";
import {
  Alert,
  Avatar,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { delay } from "../../enrollments/services/enrollmentService";
import { useStudentEnrollments } from "../hooks/useStudentEnrollments";
type Props = {
  open: boolean;
  setClose: () => void;
  selectStudent: StudentType | null;
};

export default function ConfirmationDialogRaw({
  open,
  setClose,
  selectStudent,
}: Props) {
  const radioGroupRef = useRef<HTMLElement>(null);

  const { myEnrollments, loading, error, clearError } = useStudentEnrollments();
  const [myEnrollmentsList, setMyEnrollmentsList] = useState<EnrollmentType[]>(
    [],
  );

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  useEffect(() => {
    if (!open || !selectStudent) return;
    const getData = async () => {
      const res = await myEnrollments(selectStudent?.id);
      await delay(500);
      setMyEnrollmentsList(res);
    };

    getData();
  }, [open, selectStudent]);

  const handleCancel = () => {
    setMyEnrollmentsList([]);
    setClose();
    clearError();
  };
  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      slotProps={{
        transition: {
          onEntering: handleEntering,
        },
      }}
      open={open}
    >
      <DialogTitle>Student {selectStudent?.full_name}</DialogTitle>
      <DialogContent dividers>
        {loading && (
          <>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress color="success" aria-label="Loading…" />
            </div>
          </>
        )}

        {error && <Alert severity="error">{error.message}</Alert>}

        {!loading && !error && myEnrollmentsList.length === 0 && (
          <Alert severity="info">No enrollment history.</Alert>
        )}

        {myEnrollmentsList?.map((option) => (
          <Fragment key={option.id}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                  R
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={"School Class: " + option.schoolClass.name}
              subheader={"Academic Year: " + option.academicYear.name}
            />

            <CardContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Status: {option.status}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Enrolled at: {moment(option.enrolled_at).format("YYYY-MM-DD")}
              </Typography>
            </CardContent>

            <hr />
          </Fragment>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
