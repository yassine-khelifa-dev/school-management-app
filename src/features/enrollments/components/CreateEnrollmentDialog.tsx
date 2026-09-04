import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import { forwardRef, Fragment } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import List from "@mui/material/List";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Alert, Radio } from "@mui/material";
import moment from "moment";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnrollmentFormSchema, type EnrollmentFormType } from "../types";
import { Controller, useForm } from "react-hook-form";
import useEnrollmentForm from "../hooks/useEnrollmentForm";
import BeenhereIcon from "@mui/icons-material/Beenhere";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateEnrollmentDialog({ open, setOpen }: Props) {
  const {
    creating,
    error,
    successMessage,
    students,
    setSearch,
    classList,
    academicYersList,
    selectedOptions,
    setSelectedOptions,
    handleEnrollSubmit,
  } = useEnrollmentForm();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnrollmentFormType>({
    resolver: zodResolver(EnrollmentFormSchema),
    defaultValues: {
      status: "active",
      enrolled_at: moment().format("YYYY-MM-DD"),
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: EnrollmentFormType) => {
    const success = await handleEnrollSubmit(data);
    if (success) reset();
  };

  return (
    <Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        slots={{
          transition: Transition,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Create a new Enrollment
              </Typography>
              <Button
                autoFocus
                color="inherit"
                type="submit"
                loading={creating}
                loadingIndicator="Save..."
                disabled={creating}
              >
                <BeenhereIcon sx={{ marginRight: "3px" }} /> Save
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            <div
              style={{
                padding: "20px 30px",
              }}
            >
              {error && <Alert severity="warning">{error.message}</Alert>}
              {successMessage && (
                <Alert severity="success">{successMessage}</Alert>
              )}

              <Controller
                name="student_id"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={students}
                    getOptionLabel={(student) => student.full_name}
                    getOptionKey={(student) => student.id}
                    sx={{ width: "70%", padding: "20px 0px" }}
                    onInputChange={(_, value) => setSearch(value)}
                    value={selectedOptions.student}
                    onChange={(_, student) => {
                      setSelectedOptions((prev) => ({
                        ...prev,
                        student: student,
                      }));
                      field.onChange(student?.id ?? undefined);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Students"
                        error={!!errors.student_id}
                        helperText={errors.student_id?.message}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="academic_year_id"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={academicYersList}
                    sx={{ width: "70%", paddingBottom: "20px" }}
                    getOptionKey={(st) => st.id}
                    getOptionLabel={(ay) => ay.name}
                    value={selectedOptions.year}
                    onChange={(_, year) => {
                      setSelectedOptions((prev) => ({
                        ...prev,
                        year: year,
                      }));
                      field.onChange(year?.id ?? undefined);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Academic Years"
                        error={!!errors.academic_year_id}
                        helperText={errors.academic_year_id?.message}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="class_id"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={classList}
                    sx={{ width: "70%", paddingBottom: "20px" }}
                    getOptionKey={(st) => st.id}
                    getOptionLabel={(ca) => ca.name}
                    value={selectedOptions.class}
                    onChange={(_, sc) => {
                      setSelectedOptions((prev) => ({
                        ...prev,
                        class: sc,
                      }));
                      field.onChange(sc?.id ?? undefined);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Classes"
                        error={!!errors.class_id}
                        helperText={errors.class_id?.message}
                      />
                    )}
                  />
                )}
              />

              <TextField
                style={{
                  width: "70%",
                  paddingBottom: "20px",
                }}
                label="Enroll at"
                type="date"
                {...register("enrolled_at")}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel
                      value="active"
                      control={<Radio />}
                      label="Active"
                    />

                    <FormControlLabel
                      value="completed"
                      control={<Radio />}
                      label="Completed"
                    />

                    <FormControlLabel
                      value="cancelled"
                      disabled
                      control={<Radio />}
                      label="Cancelled"
                    />
                  </RadioGroup>
                )}
              />
            </div>
          </List>
        </form>
      </Dialog>
    </Fragment>
  );
}
