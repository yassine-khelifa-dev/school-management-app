import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import type { PaginateType, StudentQueryType, StudentType } from "../types";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Pagination from "@mui/material/Pagination";
import useStudentPolicy from "../permissions";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import ConfirmationDialogRaw from "./ListEnrollmentDialog";
import { useState } from "react";
import { EnrollmentStatusBadge } from "../../../components/ui/EnrollmentStatusBadge";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

type Props = {
  students: StudentType[];
  paginate: PaginateType | null;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  query: StudentQueryType;
  onQueryChange: (newQuery: StudentQueryType) => void;
};

export default function StudentTable({
  students,
  onEdit,
  onDelete,
  onQueryChange,
  query,
  paginate,
}: Props) {
  const { canDelete, canEdit, hasActions } = useStudentPolicy();
  const [openEnrollDetails, setOpenEnrollDetails] = useState(false);
  const [selectStudent, setSelectStudent] = useState<StudentType | null>(null);

  const handleEnrollDetails = () => {
    setOpenEnrollDetails(false);
    setSelectStudent(null);
  };

  return (
    <div className="data-card">
      <ConfirmationDialogRaw
        open={openEnrollDetails}
        setClose={handleEnrollDetails}
        selectStudent={selectStudent}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell className="table-id-column">ID</StyledTableCell>
              <StyledTableCell>First name</StyledTableCell>
              <StyledTableCell>Last name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone</StyledTableCell>
              <StyledTableCell>Current class</StyledTableCell>
              <StyledTableCell>Academic year</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Enrollments</StyledTableCell>

              {hasActions && <StyledTableCell className="table-actions-column">Actions</StyledTableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell className="table-id-column">{row.id}</StyledTableCell>
                <StyledTableCell>{row.first_name}</StyledTableCell>
                <StyledTableCell>{row.last_name}</StyledTableCell>
                <StyledTableCell>{row.email}</StyledTableCell>
                <StyledTableCell>{row.phone}</StyledTableCell>
                <StyledTableCell>
                  {row.enrollment?.schoolClass?.name ?? <RemoveCircleIcon />}
                </StyledTableCell>
                <StyledTableCell>
                  {row.enrollment?.academicYear?.name ?? <RemoveCircleIcon />}
                </StyledTableCell>

                <StyledTableCell>
                  <EnrollmentStatusBadge status={row.enrollment?.status} />
                </StyledTableCell>

                <StyledTableCell>
                  <Button
                    disabled={!row.enrollments_count}
                    onClick={() => {
                      setOpenEnrollDetails(true);
                      setSelectStudent(row);
                    }}
                  >
                    <ExpandCircleDownIcon /> {row.enrollments_count ?? 0}
                  </Button>
                </StyledTableCell>

                {hasActions && (
                  <StyledTableCell className="table-actions-column">
                    <div className="table-actions">
                      {canEdit && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => onEdit(row.id)}
                          sx={{
                            textAlign: "center",
                          }}
                          aria-label="Edit student"
                          title="Edit student"
                        ><EditNoteIcon /></Button>
                      )}

                      {canDelete && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => onDelete(row.id)}
                          sx={{
                            textAlign: "center",
                          }}
                          aria-label="Delete student"
                          title="Delete student"
                        ><DeleteIcon /></Button>
                      )}
                    </div>
                  </StyledTableCell>
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pagination-bar">
        <Pagination
          count={paginate?.last_page ?? 1}
          page={paginate?.current_page ?? 1}
          color="primary"
          onChange={(_, page) => {
            onQueryChange({ ...query, page });
          }}
        />
      </div>
    </div>
  );
}
