import type { EnrollmentListType, EnrollmentType } from "../types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Pagination } from "@mui/material";
import RebaseEditIcon from "@mui/icons-material/RebaseEdit";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import { EnrollmentStatusBadge } from "../../../components/ui/EnrollmentStatusBadge";
type Props = {
  enrollments: EnrollmentListType;
  changePage: (page: number) => void;
  onEdit: (enroll: EnrollmentType) => void;
  onDelete: (enroll: EnrollmentType) => void;
  deleting: boolean;
};

export default function EnrollmentTable({
  enrollments,
  changePage,
  onEdit,
  onDelete,
  deleting,
}: Props) {
  return (
    <div className="data-card">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell className="table-id-column">ID</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Student email</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Academic year</TableCell>
              <TableCell>Enrollment date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell className="table-actions-column">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments?.data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" className="table-id-column">
                  {row.id}
                </TableCell>
                <TableCell>{row.student.full_name}</TableCell>
                <TableCell>{row.student.email}</TableCell>

                <TableCell>{row.schoolClass.name}</TableCell>
                <TableCell>{row.academicYear.name}</TableCell>
                <TableCell>
                  {moment(row.enrolled_at).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell><EnrollmentStatusBadge status={row.status} /></TableCell>
                <TableCell className="table-actions-column">
                  <div className="table-actions">
                    <Button
                      onClick={() => onEdit(row)}
                      variant="outlined"
                      color="secondary"
                      title="Edit enrollment"
                      aria-label="Edit enrollment"
                    ><RebaseEditIcon /></Button>

                    <Button
                      onClick={() => onDelete(row)}
                      color="error"
                      variant="outlined"
                      loading={deleting}
                      disabled={deleting}
                      title="Delete enrollment"
                      aria-label="Delete enrollment"
                    ><DeleteIcon /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pagination-bar">
        <Pagination
          count={enrollments?.meta.last_page ?? 1}
          page={enrollments?.meta.current_page ?? 1}
          onChange={(_, page) => changePage(page)}
          variant="outlined"
        />
      </div>
    </div>
  );
}
