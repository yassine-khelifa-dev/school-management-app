import { useParams } from "react-router";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import useApiError from "../../../hooks/useApiError";
import { getExamDetails } from "../services/examService";
import type { ExamType } from "../types";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ExamDetailsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const { clearError, error, handleError } = useApiError();

  const [exam, setExam] = useState<ExamType | null>(null);

  useEffect(() => {
    if (!id) return;
    const getData = async () => {
      try {
        clearError();
        setLoading(true);
        const res = await getExamDetails(id);
        // console.log(res);
        setExam(res);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [id]);
  const navigate = useNavigate();

  return (
    <div
      style={{
        margin: "40px auto",
        maxWidth: "900px",
        padding: "0 16px",
      }}
    >
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px 0",
          }}
        >
          <Typography color="text.secondary">
            Loading exam details...
          </Typography>
        </div>
      )}

      {error && (
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <Typography color="error">{error.message}</Typography>
        </Card>
      )}

      {!loading && !error && exam && (
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 4,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                letterSpacing: 1,
              }}
            >
              <Button onClick={() => navigate(-1)}>
                <ArrowBackIcon />
              </Button>
              
              Exam #{id}
            </Typography>

            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mt: 1,
                mb: 1,
              }}
            >
              {exam.title}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 3,
              }}
            >
              {exam.exam_date}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                lineHeight: 1.8,
              }}
            >
              {exam.description ?? "No description"}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Maximum Score
                </Typography>
                <Typography variant="h6">{exam.maximum_score}</Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Teacher
                </Typography>
                <Typography variant="h6">{exam.teacher.fullname}</Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Academic Year
                </Typography>
                <Typography variant="h6">{exam.academicYear.name}</Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Subject
                </Typography>
                <Typography variant="h6">{exam.subject.name}</Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Class
                </Typography>
                <Typography variant="h6">{exam.schoolClass.name}</Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Grades Count
                </Typography>
                <Typography variant="h6">{exam.grades_count ?? 0}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
