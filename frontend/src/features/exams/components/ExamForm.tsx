import { Fragment, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormSchemaExam, type ExamType, type FormExam } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import getOptionsTeachingAssignment from "../../teachingAssignment/services/teachingAssignmentService";
import type { TeachingAssignmentSummaryType } from "../../teachingAssignment/types";
import { Alert } from "@mui/material";
import moment from "moment";

type Props = {
  action: "EDIT" | "CREATE";
  exam?: ExamType;
  open: boolean;
  error: string;
  setClose: (open: boolean) => void;
  confirm: (data: FormExam) => Promise<boolean>;
};

export default function ExamForm({
  action,
  exam,
  open,
  setClose,
  confirm,
  error,
}: Props) {
  const [optionsTeachingAssignment, setOptionsTeachingAssignment] = useState<
    TeachingAssignmentSummaryType[]
  >([]);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormExam>({
    resolver: zodResolver(FormSchemaExam),
    defaultValues: {
      title: exam?.title ?? "",
      exam_date: exam?.exam_date ?? moment().format("YYYY-MM-DD"),
      description: exam?.description ?? "",
      maximum_score: exam?.maximum_score ?? 0,
      teaching_assignment_id: exam?.teaching_assignment_id ?? 0,
    },
  });

  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  useEffect(() => {
    const getOptions = async () => {
      try {
        setOptionsLoading(true);
        setOptionsError(null);

        const res = await getOptionsTeachingAssignment();
        setOptionsTeachingAssignment(res);
      } catch (err) {
        setOptionsError("Unable to load teaching assignments.");
      } finally {
        setOptionsLoading(false);
      }
    };

    getOptions();
  }, []);

  const onSubmit = async (data: FormExam) => {
    //console.log("handleSubmit", data);

    const success = await confirm(data);

    if (success) {
      setClose(false);
    }
  };

  return (
    <Fragment>
      <Dialog open={open} onClose={() => setClose(false)}>
        {action === "CREATE" && <DialogTitle>Create new Exam</DialogTitle>}

        {action === "EDIT" && (
          <DialogTitle>Edit Exam ID: {exam?.id}</DialogTitle>
        )}

        <DialogContent>
          <DialogContentText>You need to fill all fields</DialogContentText>
          <form onSubmit={handleSubmit(onSubmit)} id="subscription-form">
            {error && (
              <div style={{ margin: "10px 0px" }}>
                <Alert severity="error">{error}</Alert>
              </div>
            )}

            {optionsError && <Alert severity="error">{optionsError}</Alert>}

            <TextField
              {...register("title")}
              autoFocus
              margin="dense"
              fullWidth
              label="Title"
              variant="standard"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              {...register("exam_date")}
              autoFocus
              margin="dense"
              fullWidth
              label="Date Exam"
              type="date"
              variant="standard"
              error={!!errors.exam_date}
              helperText={errors.exam_date?.message}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              {...register("description")}
              autoFocus
              margin="dense"
              multiline
              rows={3}
              fullWidth
              label="Description"
              variant="standard"
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              {...register("maximum_score", {
                valueAsNumber: true,
              })}
              autoFocus
              margin="dense"
              fullWidth
              label="Maximum Score"
              type="number"
              variant="standard"
              error={!!errors.maximum_score}
              helperText={errors.maximum_score?.message}
            />

            <Controller
              control={control}
              name="teaching_assignment_id"
              render={({ field }) => (
                <FormControl
                  sx={{ m: 1, minWidth: 120 }}
                  error={!!errors.teaching_assignment_id}
                >
                  <InputLabel id={`${exam?.teaching_assignment_id}-label`}>
                    Teaching assignment
                  </InputLabel>
                  <Select
                    {...field}
                    disabled={optionsLoading || !!optionsError}
                    aria-describedby={`${exam?.teaching_assignment_id}-helper-text`}
                    labelId={`${exam?.teaching_assignment_id}-label`}
                    id={"" + exam?.teaching_assignment_id}
                    value={field.value ?? ""}
                    label="Teaching assignment"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {optionsTeachingAssignment?.map((row) => (
                      <MenuItem key={row.id} value={row.id}>
                        {row.slug}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.teaching_assignment_id?.message ??
                      "Academic Year - Class - Subject"}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClose(false)}>Cancel</Button>
          <Button
            disabled={isSubmitting}
            type="submit"
            form="subscription-form"
          >
            {action == "CREATE" && "Create"}
            {action == "EDIT" && "Edit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
