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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
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
  onQueryChange: React.Dispatch<React.SetStateAction<StudentQueryType>>;
};

export default function StudentTable({
  students,
  onEdit,
  onDelete,
  onQueryChange,
  query,
  paginate,
}: Props) {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell align="left">First Name</StyledTableCell>
              <StyledTableCell>Last name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.id}</StyledTableCell>
                <StyledTableCell>{row.first_name}</StyledTableCell>
                <StyledTableCell>{row.last_name}</StyledTableCell>
                <StyledTableCell>{row.email}</StyledTableCell>
                <StyledTableCell>{row.phone}</StyledTableCell>

                <StyledTableCell>
                  <div>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => onEdit(row.id)}
                      sx={{
                        textAlign: "center",
                        marginRight: "2px",
                      }}
                      endIcon={<EditNoteIcon />}
                    ></Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => onDelete(row.id)}
                      sx={{
                        textAlign: "center",
                      }}
                      endIcon={<DeleteIcon />}
                    ></Button>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
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
