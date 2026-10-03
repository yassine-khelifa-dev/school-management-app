import type {
  OverViewType,
  StatiscticsQueryType,
  TopStudentsType,
} from "../types";
import { TopStudents } from "./TopStudents";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { SummaryCard } from "./SummaryCard";

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
  data: TopStudentsType;
  overviewList: OverViewType;
  setQuery: (key: string, value: string) => void;
  query: StatiscticsQueryType;
};
export default function StatisticsTable({
  data,
  overviewList,
  setQuery,
  query,
}: Props) {
  const handleClick = (id) => {
    console.log(id);
    setQuery("subject", id);
  };

  return (
    <>
      <h3
        style={{
          marginBottom: "16px",
          color: "#0f172a",
          fontSize: "20px",
          fontWeight: 700,
        }}
      >
        Statistics
      </h3>

      <SummaryCard summary={overviewList.summary} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
          gap: "18px",
          alignItems: "start",
          marginTop: "18px",
        }}
      >
        {/* Subjects table */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 4px 16px rgba(15, 23, 42, 0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                background: "#e0f2fe",
                fontSize: "18px",
              }}
            >
              📊
            </div>

            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Subjects Overview
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginTop: "2px",
                }}
              >
                Performance by subject
              </div>
            </div>
          </div>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell className="table-id-column">
                    Subject
                  </StyledTableCell>

                  <StyledTableCell>Students</StyledTableCell>
                  <StyledTableCell>Average</StyledTableCell>
                  <StyledTableCell>Pass</StyledTableCell>
                  <StyledTableCell>Fail</StyledTableCell>
                  <StyledTableCell>Pass rate</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {overviewList.subjects.map((row) => {
                  const isSelected = String(query.subject) === String(row.id);

                  return (
                    <StyledTableRow
                      key={row.id}
                      onClick={() => handleClick(row.id)}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s ease",

                        backgroundColor: isSelected ? "#e0f2fe" : "#ffffff",

                        "&:hover": {
                          backgroundColor: isSelected ? "#bae6fd" : "#f0f9ff",
                        },

                        ...(isSelected && {
                          "& td:first-of-type": {
                            borderLeft: "4px solid #0284c7",
                          },

                          "& td": {
                            fontWeight: 600,
                          },
                        }),
                      }}
                    >
                      <StyledTableCell className="table-id-column">
                        {row.name}
                      </StyledTableCell>

                      <StyledTableCell>{row.students_count}</StyledTableCell>

                      <StyledTableCell>{row.average}</StyledTableCell>

                      <StyledTableCell>{row.pass_count}</StyledTableCell>

                      <StyledTableCell>{row.fail_count}</StyledTableCell>

                      <StyledTableCell>{row.pass_rate}</StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Top students */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 4px 16px rgba(15, 23, 42, 0.06)",
            minHeight: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                background: "#fef3c7",
                fontSize: "18px",
              }}
            >
              🏆
            </div>

            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Top Students
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginTop: "2px",
                }}
              >
                Best performing students
              </div>
            </div>
          </div>

          <TopStudents data={data} />
        </div>
      </div>
    </>
  );
}
