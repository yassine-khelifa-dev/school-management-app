import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import type {
  StatiscticsFilterOptionsType,
  StatiscticsQueryType,
} from "../types";

type Props = {
  data: StatiscticsFilterOptionsType;
  setQuery: (key: string, value: string) => void;
  query: StatiscticsQueryType;
};

export default function StatisticsFilter({ data, setQuery, query }: Props) {
  const [subjectSelected, setSubjectSelected] = useState("" + query.subject);
  const [academicYearSelected, setAcademicYearSelected] = useState(
    "" + query.academic_year,
  );
  const [schoolClassSelected, setSchoolClassSelected] = useState(
    "" + query.school_class,
  );

  useEffect(() => {
    const up = () => {
      setSubjectSelected("" + query.subject);
    };
    up();
  }, [query]);

  const handleChange = (event: SelectChangeEvent, key: string) => {
    const value = event.target.value;

    if (key === "subject") setSubjectSelected(value);
    if (key === "academic_year") setAcademicYearSelected(value);
    if (key === "school_class") setSchoolClassSelected(value);

    setQuery(key, value);
  };

  const controlStyle = {
    minWidth: 190,
    "& .MuiOutlinedInput-root": {
      height: 48,
      borderRadius: "10px",
      backgroundColor: "#ffffff",
      fontSize: "14px",
      color: "#0f172a",

      "& fieldset": {
        borderColor: "#dbe3ee",
      },

      "&:hover fieldset": {
        borderColor: "#94a3b8",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#0284c7",
      },
    },

    "& .MuiInputLabel-root": {
      fontSize: "13px",
      color: "#64748b",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0284c7",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <FormControl sx={controlStyle}>
        <InputLabel id="subject-label">Subject</InputLabel>

        <Select
          labelId="subject-label"
          value={subjectSelected}
          label="Subject"
          onChange={(e) => handleChange(e, "subject")}
        >
          <MenuItem value="">
            <em>All subjects</em>
          </MenuItem>

          {data?.subjects?.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={controlStyle}>
        <InputLabel id="academic-year-label">Academic Year</InputLabel>

        <Select
          labelId="academic-year-label"
          value={academicYearSelected}
          label="Academic Year"
          onChange={(e) => handleChange(e, "academic_year")}
        >
          <MenuItem value="">
            <em>Select academic year</em>
          </MenuItem>

          {data?.academic_years?.map((year) => (
            <MenuItem key={year.id} value={year.id}>
              {year.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={controlStyle}>
        <InputLabel id="school-class-label">School Class</InputLabel>

        <Select
          labelId="school-class-label"
          value={schoolClassSelected}
          label="School Class"
          onChange={(e) => handleChange(e, "school_class")}
        >
          <MenuItem value="">
            <em>All classes</em>
          </MenuItem>

          {data?.classes?.map((schoolClass) => (
            <MenuItem key={schoolClass.id} value={schoolClass.id}>
              {schoolClass.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
