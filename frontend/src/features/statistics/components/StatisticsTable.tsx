import type {
  OverViewType,
  StatiscticsQueryType,
  TopStudentsType,
} from "../types";

import { TopStudents } from "./TopStudents";
import { SummaryCard } from "./SummaryCard";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f8fafc",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    borderBottom: "1px solid #e2e8f0",
    padding: "14px 16px",
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: "13px",
    color: theme.palette.text.primary,
    padding: "15px 16px",
    borderBottom: "1px solid #eef2f7",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  transition: "background-color 0.18s ease",

  "&:last-child td, &:last-child th": {
    borderBottom: 0,
  },
}));

type Props = {
  data: TopStudentsType | null;
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
  const handleClick = (id: number) => {
    setQuery("subject", "" + id);
  };

  return (
    <>
      <Box
        sx={{
          mt: 3,
          mb: 1.5,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#0f172a",
            fontSize: "18px",
            fontWeight: 700,
          }}
        >
          Statistics
        </h3>
      </Box>

      <SummaryCard summary={overviewList.summary} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 2fr) 340px",
          },
          gap: 2.5,
          alignItems: "start",
          mt: 2.5,
        }}
      >
        {/* Subjects overview */}
        <Box
          sx={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 2,
              borderBottom: "1px solid #eef2f7",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                backgroundColor: "#e0f2fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                flexShrink: 0,
              }}
            >
              📊
            </Box>

            <Box>
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
                  marginTop: "2px",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Performance by subject
              </div>
            </Box>
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 0,
              overflowX: "auto",
            }}
          >
            <Table
              sx={{
                minWidth: 760,
              }}
              aria-label="statistics table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Subject</StyledTableCell>
                  <StyledTableCell align="center">Students</StyledTableCell>
                  <StyledTableCell align="center">Average</StyledTableCell>
                  <StyledTableCell align="center">
                    Graded records
                  </StyledTableCell>
                  <StyledTableCell align="center">Pass</StyledTableCell>
                  <StyledTableCell align="center">Fail</StyledTableCell>
                  <StyledTableCell>Pass rate</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {overviewList.subjects.map((row) => {
                  const isSelected = String(query.subject) === String(row.id);

                  const passRate = Number(row.pass_rate ?? 0);
                  const rateColor = passRate >= 50 ? "#16a34a" : "#dc2626";

                  return (
                    <StyledTableRow
                      key={row.id}
                      onClick={() => handleClick(row.id)}
                      sx={{
                        cursor: "pointer",

                        backgroundColor: isSelected ? "#f0f9ff" : "#ffffff",

                        "&:hover": {
                          backgroundColor: isSelected ? "#e0f2fe" : "#f8fafc",
                        },

                        ...(isSelected && {
                          "& td:first-of-type": {
                            borderLeft: "4px solid #0284c7",
                            paddingLeft: "12px",
                          },
                        }),
                      }}
                    >
                      {/* Subject */}
                      <StyledTableCell>
                        <span
                          style={{
                            fontWeight: isSelected ? 700 : 600,
                            color: "#0f172a",
                          }}
                        >
                          {row.name}
                        </span>
                      </StyledTableCell>

                      {/* Students */}
                      <StyledTableCell align="center">
                        <span
                          style={{
                            color: "#475569",
                            fontWeight: 600,
                          }}
                        >
                          {row.students_count}
                        </span>
                      </StyledTableCell>

                      {/* Average */}
                      <StyledTableCell align="center">
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "62px",
                            padding: "5px 9px",
                            borderRadius: "999px",
                            backgroundColor: "#ecfeff",
                            color: "#0f766e",
                            fontWeight: 700,
                          }}
                        >
                          {Number(row.average).toFixed(1)}%
                        </span>
                      </StyledTableCell>

                      {/* Graded records */}
                      <StyledTableCell align="center">
                        <span
                          style={{
                            display: "inline-flex",
                            minWidth: "44px",
                            justifyContent: "center",
                            padding: "4px 8px",
                            borderRadius: "7px",
                            backgroundColor: "#f1f5f9",
                            color: "#475569",
                            fontWeight: 600,
                          }}
                        >
                          {row.graded_records_count}
                        </span>
                      </StyledTableCell>

                      {/* Pass */}
                      <StyledTableCell align="center">
                        <span
                          style={{
                            color: "#16a34a",
                            fontWeight: 700,
                          }}
                        >
                          {row.pass_count}
                        </span>
                      </StyledTableCell>

                      {/* Fail */}
                      <StyledTableCell align="center">
                        <span
                          style={{
                            color: "#dc2626",
                            fontWeight: 700,
                          }}
                        >
                          {row.fail_count}
                        </span>
                      </StyledTableCell>

                      {/* Pass rate */}
                      <StyledTableCell>
                        <Box
                          sx={{
                            minWidth: 90,
                            maxWidth: 120,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 0.7,
                            }}
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#64748b",
                                fontWeight: 600,
                              }}
                            >
                              {passRate.toFixed(0)}%
                            </span>
                          </Box>

                          <Box
                            sx={{
                              width: "100%",
                              height: "5px",
                              borderRadius: "999px",
                              backgroundColor: "#e2e8f0",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                height: "100%",
                                width: `${Math.min(passRate, 100)}%`,
                                backgroundColor: rateColor,
                                borderRadius: "999px",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </Box>
                        </Box>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Top students */}
        <Box
          sx={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 2,
              borderBottom: "1px solid #eef2f7",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                backgroundColor: "#fef3c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              🏆
            </Box>

            <Box>
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
                  marginTop: "2px",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Best performing students
              </div>
            </Box>
          </Box>

          <Box
            sx={{
              p: 1.5,
            }}
          >
            <TopStudents data={data} />
          </Box>
        </Box>
      </Box>
    </>
  );
}
