import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateStudentSchema, type InputsCreateStudentValues } from "../types";
import { Alert } from "@mui/material";
import type { ApiErrorType } from "../../../utils/apiError";
type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirm: (data: InputsCreateStudentValues) => Promise<boolean>;
  backerrors: ApiErrorType | null;
};

export default function CreateStudentDialog({
  open,
  setOpen,
  confirm,
  backerrors,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputsCreateStudentValues>({
    resolver: zodResolver(CreateStudentSchema),
    defaultValues: {
      first_name: "test",
      last_name: "test",
      email: "test@test.com",
      phone: "1234567890",
    },
  });

  const onSubmit: SubmitHandler<InputsCreateStudentValues> = async (data) => {
    const success = await confirm(data);

    console.log("onSubmit", success);

    if (success) reset();
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)} id="create-student-form">
          <DialogTitle>Add Studnet</DialogTitle>
          <DialogContent>
            <DialogContentText>Create a new Student.</DialogContentText>

            {backerrors && (
              <Alert
                style={{
                  width: 500,
                }}
                severity="error"
              >
                {backerrors.message}
              </Alert>
            )}

            <TextField
              {...register("first_name")}
              autoFocus
              margin="dense"
              id="first_name"
              name="first_name"
              label="First name"
              type="text"
              fullWidth
              variant="standard"
            />
            {errors.first_name && (
              <span style={{ color: "red" }}>{errors.first_name.message}</span>
            )}
            <TextField
              {...register("last_name")}
              margin="dense"
              id="last_name"
              name="last_name"
              label="Last name"
              type="text"
              fullWidth
              variant="standard"
            />
            {errors.last_name && (
              <span style={{ color: "red" }}>{errors.last_name.message}</span>
            )}

            <TextField
              {...register("email")}
              margin="dense"
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="standard"
            />
            {errors.email && (
              <span style={{ color: "red" }}>{errors.email.message}</span>
            )}

            <TextField
              {...register("phone")}
              margin="dense"
              id="phone"
              name="phone"
              label="Phone"
              type="text"
              fullWidth
              variant="standard"
            />
            {errors.phone && (
              <span style={{ color: "red" }}>{errors.phone.message}</span>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
