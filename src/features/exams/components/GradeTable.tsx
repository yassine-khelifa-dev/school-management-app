import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import UpdateIcon from "@mui/icons-material/Update";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  createGradesSchema,
  type ExamGradeType,
  type GradesFormType,
  type GradeType,
} from "../types";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useExamPolicy } from "../permissions";
import useExamGradesActions from "../hooks/useExamGradesActions";
import DeleteExamGradeDialog from "./DeleteExamGradeDialog";
import { useEffect, useState } from "react";

type Props = {
  refresh: () => void;
  obj: ExamGradeType;
};

export default function GradeTable({ obj, refresh }: Props) {
  const [openDelDialog, setOpenDelDialog] = useState<boolean>(false);
  const [gradeSelect, setGradeSelect] = useState<GradeType | null>(null);

  const { error, message, loading, onDelete, onUpdateGrades } =
    useExamGradesActions();
  const { canManageGrades } = useExamPolicy();

  const schema = createGradesSchema(obj.meta.maximum_score);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GradesFormType>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    reset({
      grades: obj.data.map((row) => ({
        student_id: row.id,
        score: row.grade.score ?? null,
        comment: row.grade.comment ?? null,
      })),
    });
  }, [obj.data, reset]);

  const onSubmit = async (data: GradesFormType) => {
    const success = await onUpdateGrades("" + obj.exam.id, data);
    if (success) {
      refresh();
    }
  };

  const handleDeleteGrade = (grade: GradeType) => {
    setGradeSelect(grade);
    setOpenDelDialog(true);
  };

  const confirmDel = async () => {
    if (!gradeSelect?.grade.id) return;
    const success = await onDelete(obj.exam.id, gradeSelect.grade.id);
    if (success) {
      refresh();
      setOpenDelDialog(false);
    }
  };
  return (
    <>
      {gradeSelect && openDelDialog && (
        <DeleteExamGradeDialog
          data={gradeSelect}
          open={openDelDialog}
          setClose={setOpenDelDialog}
          handleConfirm={confirmDel}
          error={error?.message}
          loading={loading}
        />
      )}

      {obj.data.length === 0 ? (
        <>
          <Alert severity="success" sx={{ mb: 2 }}>
            No students are enrolled for this exam.
          </Alert>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 2px",
            }}
          >
            <h1>Student Grades</h1>
            <Button
              color="warning"
              variant="contained"
              type="submit"
              disabled={isSubmitting || loading}
              loading={isSubmitting}
              startIcon={<UpdateIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 2,
              }}
            >
              Update Scores
            </Button>
          </div>

          <div>
            {loading && (
              <Box
                sx={{
                  py: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CircularProgress size={28} />

                <Typography color="text.secondary">
                    Processing...
                </Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error.message}
              </Alert>
            )}

            {message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}
          </div>

          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            <Table sx={{ minWidth: 700 }} aria-label="exam grades table">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Student ID</TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    Student Full Name
                  </TableCell>

                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Score
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>Graded At</TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>Comment</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Update Score</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {obj.data.map((row, index) => {
                  const isGraded = row.grade.id !== null;

                  return (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell>{row.id}</TableCell>

                      <TableCell sx={{ fontWeight: 500 }}>
                        {row.full_name}
                      </TableCell>

                      <TableCell align="right">
                        {isGraded ? (
                          row.grade.score
                        ) : (
                          <Chip
                            icon={<HourglassEmptyRoundedIcon />}
                            label="Not yet graded"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>

                      <TableCell>{row.grade.graded_at ?? "—"}</TableCell>

                      <TableCell>
                        <TextField
                          {...register(`grades.${index}.comment`)}
                          error={!!errors.grades?.[index]?.comment}
                          helperText={errors.grades?.[index]?.comment?.message}
                        />
                      </TableCell>

                      <TableCell>
                        <input
                          type="hidden"
                          value={row.id}
                          {...register(`grades.${index}.student_id`, {
                            valueAsNumber: true,
                          })}
                        />

                        <TextField
                          type="number"
                          slotProps={{
                            htmlInput: {
                              step: "any",
                            },
                          }}
                          {...register(`grades.${index}.score`, {
                            setValueAs: (value) =>
                              value === "" ||
                              value === null ||
                              value === undefined
                                ? null
                                : Number(value),
                          })}
                          error={!!errors.grades?.[index]?.score}
                          helperText={errors.grades?.[index]?.score?.message}
                        />
                      </TableCell>
                      <TableCell>
                        {canManageGrades && isGraded && (
                          <Button
                            color="error"
                            title="Delete"
                            onClick={() => handleDeleteGrade(row)}
                            variant="contained"
                          >
                            <DeleteIcon />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </form>
      )}
    </>
  );
}
