import type { EnrollmentListType } from "../types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Pagination } from "@mui/material";

import moment from "moment";

type Props = {
  enrollments: EnrollmentListType;
  changePage: (page: number) => void;
};

export default function EnrollmentTable({ enrollments, changePage }: Props) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Studane</TableCell>
              <TableCell>Studane Email</TableCell>
              <TableCell align="right">Class</TableCell>
              <TableCell align="right">Academic Year</TableCell>
              <TableCell align="right">Enrolled at</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments?.data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.student.full_name}</TableCell>
                <TableCell>{row.student.email}</TableCell>

                <TableCell align="right"> {row.schoolClass.name}</TableCell>
                <TableCell align="right">{row.academicYear.name}</TableCell>
                <TableCell align="right">
                  {moment(row.enrolled_at).format("MM-DD-YYYY")}
                </TableCell>
                <TableCell align="right">{row.status}</TableCell>
                <TableCell align="right">EDIT | DELETE</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          paddingTop: "10px",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Pagination
          count={enrollments?.meta.last_page ?? 1}
          page={enrollments?.meta.current_page ?? 1}
          onChange={(_, page) => changePage(page)}
          variant="outlined"
        />
      </div>
    </>
  );
}
