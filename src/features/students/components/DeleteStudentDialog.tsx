import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import type { StudentType } from "../types";
import { Alert } from "@mui/material";


type Props = {
  open: boolean;
  backerrors: string | null;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  student: StudentType | null;
  confirm: () => void;
};

export default function DeleteStudentDialog({
  open,
  setOpen,
  student,
  confirm,
  backerrors,
}: Props) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are sure you want to delete this student?"}
        </DialogTitle>
        {backerrors && (
          <Alert
            style={{
              width: 500,
            }}
            severity="error"
          >
            {backerrors}
          </Alert>
        )}

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Student ID : {student?.id} <br />
            Full name : {student?.full_name} <br />
            Email : {student?.email} <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} autoFocus>
            Disagree
          </Button>
          <Button
            onClick={() => {
              confirm();
            }}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
