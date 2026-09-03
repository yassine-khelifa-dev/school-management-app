import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import { forwardRef, Fragment, useEffect, useState } from "react";
import type { AcademicYearsType } from "../../academicYears/types";
import type { SchoolClassType } from "../../schoolClasses/types";
import { getAcademicYears } from "../../academicYears/services/academicYears";
import getSchoolClasses from "../../schoolClasses/services/schoolClass";
import Autocomplete from "@mui/material/Autocomplete";
import List from "@mui/material/List";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import type { StudentType } from "../../students/types";
import { getStudents } from "../../students/services/studentService";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Alert, Radio } from "@mui/material";
import { createEnrollment } from "../services/enrollmentService";
import moment from "moment";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnrollmentFormSchema, type EnrollmentFormType } from "../types";
import { Controller, useForm } from "react-hook-form";
import useApiError from "../../../hooks/useApiError";

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
  const { error, clearError, handleError } = useApiError();
  const [successMessage, setSuccessMessage] = useState("");
  const [students, setStudents] = useState<StudentType[]>([]);
  const [serach, setSearch] = useState<string>("");

  const [academicYersList, setAcademicYersList] = useState<AcademicYearsType[]>(
    [],
  );
  const [classList, setClassList] = useState<SchoolClassType[]>([]);

  const [selectedOptions, setSelectedOptions] = useState({
    student: null,
    year: null,
    class: null,
  });

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

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const resStudent = await getStudents(
          {
            fullname: serach,
          },
          controller.signal,
        );

        console.log(resStudent);

        setStudents(resStudent.data);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("ok");
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [serach]);

  useEffect(() => {
    const getData = async () => {
      try {
        const resAY = await getAcademicYears();
        const resSC = await getSchoolClasses();

        console.log(resAY);

        setAcademicYersList(resAY);
        setClassList(resSC);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("ok");
      }
    };

    getData();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleEnrollSubmit = async (data: EnrollmentFormType) => {
    try {
      clearError();
      setSuccessMessage("");
      console.log("handleSubmit", data);
      const res = await createEnrollment({ ...data });
      if (res.data.data.id > 0) {
        reset();
        setSelectedOptions({ student: null, year: null, class: null });
        setSuccessMessage("The enrollment has created successfuly!");
      }

      // store Data
    } catch (err) {
      const r = handleError(err);
      console.log(r);
    } finally {
      console.log("end submit");
    }

    //  handleClose();
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
        <form onSubmit={handleSubmit(handleEnrollSubmit)}>
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
              <Button autoFocus color="inherit" type="submit">
                save
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
                      setSelectedOptions({
                        ...selectedOptions,
                        student: student,
                      });
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
                      setSelectedOptions({
                        ...selectedOptions,
                        year: year,
                      });
                      field.onChange(year?.id ?? undefined);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Academic Years"
                        error={!!errors.student_id}
                        helperText={errors.student_id?.message}
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
                      setSelectedOptions({
                        ...selectedOptions,
                        class: sc,
                      });
                      field.onChange(sc?.id ?? undefined);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Classes"
                        error={!!errors.student_id}
                        helperText={errors.student_id?.message}
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
              {errors.enrolled_at && errors.enrolled_at.message}

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
