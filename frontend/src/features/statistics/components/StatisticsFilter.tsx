import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Box from "@mui/material/Box";
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
  const handleChange = (event: SelectChangeEvent, key: string) => {
    const value = event.target.value;
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
          value={query.subject ?? "all"}
          label="Subject"
          onChange={(e) => handleChange(e, "subject")}
        >
          <MenuItem value="all">
            <em>All subjects</em>
          </MenuItem>

          {data?.subjects?.map((subject) => (
            <MenuItem key={subject.id} value={String(subject.id)}>
              {subject.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={controlStyle}>
        <InputLabel id="academic-year-label">Academic Year</InputLabel>

        <Select
          labelId="academic-year-label"
            value={query.academic_year ?? ""}
          label="Academic Year"
          onChange={(e) => handleChange(e, "academic_year")}
        >

          {data?.academic_years?.map((year) => (
            <MenuItem key={year.id} value={String(year.id)}>
              {year.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={controlStyle}>
        <InputLabel id="school-class-label">School Class</InputLabel>

        <Select
          labelId="school-class-label"
          value={query.school_class ?? "all"}
          label="School Class"
          onChange={(e) => handleChange(e, "school_class")}
        >
          <MenuItem value="all">
            <em>All classes</em>
          </MenuItem>

          {data?.classes?.map((schoolClass) => (
            <MenuItem key={schoolClass.id} value={String(schoolClass.id)}>
              {schoolClass.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
