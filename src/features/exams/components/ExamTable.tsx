import type { ExamListType, ExamType } from "../types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Pagination } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { useExamPolicy } from "../permissions";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { useNavigate } from "react-router";
type Props = {
  examList: ExamListType;
  changePage: (page: number) => void;
  onDelete: (exam: ExamType) => void;
  onEdit: (exam: ExamType) => void;
};

export default function ExamTable({
  examList,
  changePage,
  onDelete,
  onEdit,
}: Props) {
  const { canEdit, canViewAny, canDelete, canManageGrades } = useExamPolicy();
  const navigate = useNavigate();

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Exam date</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Academic Year</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examList?.data.map((exam) => (
              <TableRow
                key={exam.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {exam.id}
                </TableCell>
                <TableCell>{exam.title}</TableCell>
                <TableCell>{exam.exam_date}</TableCell>
                <TableCell>{exam.teacher.fullname}</TableCell>
                <TableCell>{exam.subject.name}</TableCell>
                <TableCell>{exam.academicYear.name}</TableCell>

                <TableCell align="center">
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      justifyContent: "center",
                    }}
                  >
                    {canViewAny && (
                      <Button
                        color="warning"
                        title="Show"
                        onClick={() => navigate("/exams/" + exam.id)}
                        variant="contained"
                      >
                        <DocumentScannerIcon />
                      </Button>
                    )}

                    {canEdit && (
                      <Button
                        title="Edit"
                        onClick={() => onEdit(exam)}
                        variant="contained"
                      >
                        <EditSquareIcon />
                      </Button>
                    )}

                    {canManageGrades && (
                      <Button
                        color="secondary"
                        title="Manage Grades"
                        onClick={() =>
                          navigate("/exams/" + exam.id + "/grades")
                        }
                        variant="contained"
                      >
                        <ChecklistIcon />
                      </Button>
                    )}

                    {canDelete && (
                      <Button
                        color="error"
                        title="Delete"
                        onClick={() => onDelete(exam)}
                        variant="contained"
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Pagination
          style={{
            paddingTop: "10px",
            marginLeft: "auto",
            width: "fit-content",
          }}
          count={examList?.meta?.last_page ?? 1}
          page={examList?.meta?.current_page ?? 1}
          color="primary"
          onChange={(_, page) => {
            changePage(page);
          }}
        />
      </div>
    </>
  );
}
