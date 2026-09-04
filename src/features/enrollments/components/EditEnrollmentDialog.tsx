import { forwardRef, Fragment, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { type TransitionProps } from "@mui/material/transitions";
import {
  EnrollmentFormSchema,
  type EnrollmentFormType,
  type EnrollmentType,
} from "../types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Autocomplete,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import useEnrollmentForm from "../hooks/useEnrollmentForm";
import RebaseEditIcon from "@mui/icons-material/RebaseEdit";
import moment from "moment";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selecteEnroll: EnrollmentType;
  refresh: () => void;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditEnrollmentDialog({
  open,
  setOpen,
  selecteEnroll,
  refresh,
}: Props) {
  const {
    editing,
    setSuccessMessage,
    error,
    successMessage,
    students,
    setSearch,
    clearError,
    classList,
    academicYersList,
    selectedOptions,
    setSelectedOptions,
    handleEnrollEditSubmit,
  } = useEnrollmentForm();
  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm<EnrollmentFormType>({
    resolver: zodResolver(EnrollmentFormSchema),
    defaultValues: {
      enrolled_at: moment().format("YYYY-MM-DD"),
    },
  });

  useEffect(() => {
    if (!selecteEnroll) return;

    setSelectedOptions({
      student: selecteEnroll?.student,
      year: selecteEnroll?.academicYear,
      class: selecteEnroll?.schoolClass,
    });

    reset({
      student_id: selecteEnroll.student.id,
      academic_year_id: selecteEnroll.academicYear.id,
      class_id: selecteEnroll.schoolClass.id,
      enrolled_at: moment(selecteEnroll.enrolled_at).format("YYYY-MM-DD"),
      status: selecteEnroll.status,
    });
  }, [selecteEnroll, setSelectedOptions, reset]);

  const handleClose = () => {
    setOpen(false);
    setSuccessMessage("");
    clearError();
  };

  const onSubmit = async (data: EnrollmentFormType) => {
    const success = await handleEnrollEditSubmit(data, selecteEnroll);

    if (success) {
      refresh();
    }
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
            <Toolbar
              style={{
                background: "gray",
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Edit Enrollment ID: {selecteEnroll?.id}
              </Typography>
              <Button
                autoFocus
                color="inherit"
                type="submit"
                loading={editing}
                loadingIndicator="Editing..."
                disabled={editing}
              >
                <RebaseEditIcon sx={{ marginRight: "3px" }} /> Edit
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
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
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
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
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
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
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
