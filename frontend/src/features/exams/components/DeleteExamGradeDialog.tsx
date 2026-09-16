import { Fragment } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Alert, CircularProgress } from "@mui/material";
import type { GradeType } from "../types";

type Props = {
  data: GradeType;
  open: boolean;
  setClose: (open: boolean) => void;
  handleConfirm: () => void;
  error: string;
  loading: boolean;
};

export default function DeleteExamGradeDialog({
  data,
  open,
  setClose,
  handleConfirm,
  error,
  loading,
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
        <DialogTitle id="alert-dialog-title">{"Delete Grade"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {error && (
              <div style={{ margin: "10px 0px" }}>
                <Alert severity="error">{error}</Alert>
              </div>
            )}
            Are you sure to delete this grade for student {data?.full_name} with
            score {data.grade.score}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClose(false)} autoFocus>
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleConfirm}>
            {loading ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
