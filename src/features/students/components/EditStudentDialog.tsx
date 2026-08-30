import type { FormStudentInputs, StudentType } from "../types";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import { useForm, type SubmitHandler } from "react-hook-form";
import { Alert } from "@mui/material";

type Props = {
  open: boolean;
  backerrors: string | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  student: StudentType;
  confirm: (data: FormStudentInputs) => void;
};

export function EditStudentDialog({
  open,
  setOpen,
  student,
  confirm,
  backerrors,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormStudentInputs>();
  const onSubmit: SubmitHandler<FormStudentInputs> = (data) => {
    confirm(data);
  };

  React.useEffect(() => {
    if (student) {
      reset({
        id: student.id,
        fullname: student.full_name,
        email: student.email,
        phone: "" + Math.floor(1000000000 + Math.random() * 9000000000),
      });
    }
  }, [student, reset]);
  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="alert-dialog-title">Edit Student</DialogTitle>

          <DialogContent>
            <Grid
              container
              spacing={3}
              sx={{
                pt: 1,
                width: 500,
              }}
            >
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

              <Grid size={12}>
                <TextField
                  fullWidth
                  id="id_fullname"
                  label="Full Name"
                  variant="outlined"
                  {...register("fullname", {
                    required: "Full name is required",
                    minLength: {
                      value: 5,
                      message: "Full name must be at least 5 characters",
                    },
                  })}
                  error={!!errors.fullname}
                  helperText={errors.fullname?.message}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  id="id_email"
                  label="Email"
                  variant="outlined"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  id="id_phone"
                  label="Phone"
                  variant="outlined"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d+$/,
                      message: "Phone number must contain digits only",
                    },
                    minLength: {
                      value: 10,
                      message: "Phone number must be at least 10 digits",
                    },
                    maxLength: {
                      value: 15,
                      message: "Phone number must not exceed 15 digits",
                    },
                  })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>

            <Button type="submit" variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
