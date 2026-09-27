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
    <div className="data-card">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell className="table-id-column">ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Exam date</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Academic year</TableCell>
              <TableCell className="table-actions-column">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examList?.data.map((exam) => (
              <TableRow
                key={exam.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" className="table-id-column">
                  {exam.id}
                </TableCell>
                <TableCell>{exam.title}</TableCell>
                <TableCell>{exam.exam_date}</TableCell>
                <TableCell>{exam.teacher.fullname}</TableCell>
                <TableCell>{exam.subject.name}</TableCell>
                <TableCell>{exam.academicYear.name}</TableCell>

                <TableCell className="table-actions-column">
                  <div className="table-actions">
                    {canViewAny && (
                      <Button
                        color="warning"
                        title="View exam"
                        aria-label="View exam"
                        onClick={() => navigate("/exams/" + exam.id)}
                        variant="contained"
                      >
                        <DocumentScannerIcon />
                      </Button>
                    )}

                    {canEdit && (
                      <Button
                        title="Edit exam"
                        aria-label="Edit exam"
                        onClick={() => onEdit(exam)}
                        variant="contained"
                      >
                        <EditSquareIcon />
                      </Button>
                    )}

                    {canManageGrades && (
                      <Button
                        color="secondary"
                        title="Manage grades"
                        aria-label="Manage grades"
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
                        title="Delete exam"
                        aria-label="Delete exam"
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

      <div className="pagination-bar">
        <Pagination
          count={examList?.meta?.last_page ?? 1}
          page={examList?.meta?.current_page ?? 1}
          color="primary"
          onChange={(_, page) => {
            changePage(page);
          }}
        />
      </div>
    </div>
  );
}
