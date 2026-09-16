import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import GradeTable from "../components/GradeTable";
import useExamGrades from "../hooks/useExamGrades";
import ReplyIcon from "@mui/icons-material/Reply";
export default function ExamGradesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { grades, error, loading, refresh } = useExamGrades(id);

  return (
    <Box sx={{ width: "97%", px: 2, py: 2 }}>
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

          <Typography color="text.secondary">Loading exam grades...</Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      {grades && (
        <>
          {/* Exam header */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  <Button onClick={() => navigate(-1)}>
                    <ReplyIcon />
                  </Button>
                  {grades.exam.title}
                </Typography>

                {grades.exam.description && (
                  <Typography color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                    {grades.exam.description}
                  </Typography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <Chip
                    label={`Subject: ${grades.exam.subject.name}`}
                    size="small"
                    variant="outlined"
                  />

                  <Chip
                    label={`Class: ${grades.exam.schoolClass.name}`}
                    size="small"
                    variant="outlined"
                  />

                  <Chip
                    label={`Academic Year: ${grades.exam.academicYear.name}`}
                    size="small"
                    variant="outlined"
                  />

                  <Chip
                    label={`Exam Date: ${grades.exam.exam_date}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Maximum Score
                </Typography>

                <Typography variant="h4" fontWeight={600}>
                  {grades.exam.maximum_score}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 5,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Students
                </Typography>

                <Typography fontWeight={600}>
                  {grades.meta.students_count}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Graded
                </Typography>

                <Typography fontWeight={600}>
                  {grades.meta.grades_count}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Not Yet Graded
                </Typography>

                <Typography fontWeight={600}>
                  {grades.meta.students_count - grades.meta.grades_count}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Grades table */}

          {grades && <GradeTable obj={grades} refresh={refresh} />}
        </>
      )}
    </Box>
  );
}
