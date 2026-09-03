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
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Radio } from "@mui/material";
import { createEnrollment } from "../services/enrollmentService";
import moment from "moment";
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
  const [students, setStudents] = useState<StudentType[]>([]);
  const [serach, setSearch] = useState<string>("");
  const [selectEnrollAt, setSelectEnrollAt] = useState<string>(
    moment().format("YYYY-MM-DD"),
  );
  const [academicYersList, setAcademicYersList] = useState<AcademicYearsType[]>(
    [],
  );
  const [classList, setClassList] = useState<SchoolClassType[]>([]);

  const [selectStudent, setSelectStudent] = useState<StudentType | null>(null);
  const [selectAcademicYear, setSelectAcademicYear] =
    useState<AcademicYearsType | null>(null);
  const [selectClass, setSelectClass] = useState<SchoolClassType | null>(null);

  const [selectStatus, setSelectStatus] = useState<string | null>("active");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit");

    console.log("student", selectStudent);
    console.log("academic", selectAcademicYear);
    console.log("class", selectClass);
    console.log("status", selectStatus);

    // store Data

    const res = await createEnrollment({
      student_id: selectStudent.id,
      academic_year_id: selectAcademicYear.id,
      class_id: selectClass.id,
      status: selectStatus,
      enrolled_at: selectEnrollAt,
    });

    console.log(res);

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
        <form onSubmit={handleSubmit}>
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
              <Autocomplete
                disablePortal
                id="students"
                options={students}
                getOptionKey={(st) => st.id}
                getOptionLabel={(st) => st.full_name}
                onChange={(_, val) => setSelectStudent(val)}
                onInputChange={(_, val) => setSearch(val)}
                sx={{ width: "70%", paddingBottom: "20px" }}
                renderInput={(params) => (
                  <TextField {...params} label="Students" />
                )}
              />

              <Autocomplete
                disablePortal
                id="academicyears"
                options={academicYersList}
                getOptionLabel={(ay) => ay.name}
                getOptionKey={(ay) => ay.id}
                onChange={(_, val) => setSelectAcademicYear(val)}
                sx={{ width: "70%", paddingBottom: "20px" }}
                renderInput={(params) => (
                  <TextField {...params} label="Academic Years" />
                )}
              />

              <Autocomplete
                id="classess"
                options={classList}
                getOptionLabel={(ca) => ca.name}
                getOptionKey={(ca) => ca.id}
                sx={{ width: "70%", paddingBottom: "20px" }}
                renderInput={(params) => (
                  <TextField {...params} label="Classes" />
                )}
                onChange={(_, value) => setSelectClass(value)}
              />

              <TextField
                style={{
                  width: "70%",
                  paddingBottom: "20px",
                }}
                value={selectEnrollAt}
                onChange={(e) => setSelectEnrollAt(e.target.value)}
                label="Enroll at"
                type="date"
              />

              <FormControl
                style={{
                  width: "70%",
                  paddingBottom: "20px",
                }}
              >
                <FormLabel id="status-label">Status</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="status-label"
                  name="row-radio-buttons-group"
                  value={selectStatus}
                  onChange={(e) => setSelectStatus(e.target.value)}
                >
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
              </FormControl>
            </div>
          </List>
        </form>
      </Dialog>
    </Fragment>
  );
}
