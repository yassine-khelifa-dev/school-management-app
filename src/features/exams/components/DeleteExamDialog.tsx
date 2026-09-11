import { Fragment } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import type { ExamType } from "../types";
import { Alert } from "@mui/material";

type Props = {
  exam: ExamType;
  open: boolean;
  setClose: (open: boolean) => void;
  handleConfirm: () => void;
  error: string;
};

export default function DeleteExamDialog({
  exam,
  open,
  setClose,
  handleConfirm,
  error
}: Props) {
  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={() => setClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Exam"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {error && (
              <div style={{ margin: "10px 0px" }}>
                <Alert severity="error">{error}</Alert>
              </div>
            )}
            Are you sure to delete this exam ID {exam?.id}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClose(false)} autoFocus>
            Disagree
          </Button>
          <Button onClick={handleConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
