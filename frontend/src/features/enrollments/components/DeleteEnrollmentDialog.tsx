//

import { Fragment } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import type { EnrollmentType } from "../types";
type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selecteEnroll: EnrollmentType;
  confirm: () => void;
};
export default function DeleteEnrollmentDialog({
  open,
  setOpen,
  selecteEnroll,
  confirm,
}: Props) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete this enrollment ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Enrollment details:</DialogContentText>

          <p>ID: {selecteEnroll.id}</p>
          <p>Student: {selecteEnroll.student.full_name}</p>
          <p>Year: {selecteEnroll.academicYear.name}</p>
          <p>Status: {selecteEnroll.status}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
          <Button onClick={confirm}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
