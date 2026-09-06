import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import type { StudentType } from "../types";
import { useStudentList } from "../hooks/useStudentList";
import type { EnrollmentType } from "../../enrollments/types";
import moment from "moment";
import {
  Avatar,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { delay } from "../../enrollments/services/enrollmentService";
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

  const { myEnrollments } = useStudentList();
  const [myEnrollmentsList, setMyEnrollmentsList] = useState<EnrollmentType[]>(
    [],
  );

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  useEffect(() => {
    if (!selectStudent) return;
    const getData = async () => {
      const res = await myEnrollments(selectStudent?.id);
      await delay(500);
      setMyEnrollmentsList(res);
    };

    getData();
  }, [selectStudent]);

  const handleCancel = () => {
    setMyEnrollmentsList([]);
    setClose();
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
        {myEnrollmentsList.length === 0 && (
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

        {myEnrollmentsList?.map((option) => (
          <>
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
                <h4> Status: {option.status}</h4>
                <h4>
                  {" "}
                  Enrolled at: {moment(option.enrolled_at).format("YYYY-MM-DD")}
                </h4>
              </Typography>
            </CardContent>

            <hr />
          </>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
