import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import type { EnrollQueryType } from "../types";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import type { AcademicYearsType } from "../../academicYears/types";
import type { SchoolClassType } from "../../schoolClasses/types";

type Props = {
  query: EnrollQueryType;
  setQuery: (query: EnrollQueryType) => void;
  academicYers: AcademicYearsType[];
  schoolClasses: SchoolClassType[];
};

export default function EnrollmentFilter({
  query,
  setQuery,
  academicYers,
  schoolClasses,
}: Props) {
  const [academicYearSelected, setAcademicYearSelected] = useState<
    string | null
  >(null);

  const [schoolClassesSelected, setSchoolClassesSelected] = useState<
    string | null
  >(null);

  const handleChangeAcademicYear = (event: SelectChangeEvent) => {
    setQuery({
      ...query,
      page: 1,
      filter: { ...query.filter, academicYearSelected: event.target.value },
    });
    setAcademicYearSelected(event.target.value as string);
  };

  const handleChangeSchoolClass = (event: SelectChangeEvent) => {
    setQuery({
      ...query,
      page: 1,
      filter: { ...query.filter, schoolClassesSelected: event.target.value },
    });
    setSchoolClassesSelected(event.target.value as string);
  };

  return (
    <div
      style={{
        border: "blue 1px solid",
        padding: "13px",
        margin: "5px 0px",
      }}
    >
      <h3>Filter</h3>
      <FormControl>
        <FormLabel id="q_status">Status</FormLabel>
        <RadioGroup
          row
          aria-labelledby="q_status"
          name="row-radio-buttons-group"
          value={query.filter.status}
          onChange={(e) =>
            setQuery({
              ...query,
              page: 1,
              filter: { ...query.filter, status: e.target.value },
            })
          }
        >
          <FormControlLabel value="all" control={<Radio />} label="All" />

          <FormControlLabel value="active" control={<Radio />} label="Active" />
          <FormControlLabel
            value="completed"
            control={<Radio />}
            label="Completed"
          />
          <FormControlLabel
            value="cancelled"
            control={<Radio />}
            label="Cancelled"
          />
        </RadioGroup>
      </FormControl>

      <div
        style={{ 
          display: "flex",
          gap: "10px",
          padding: "10px 0px"
         }}
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Academic Year</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={academicYearSelected}
            label="Academic Year"
            onChange={handleChangeAcademicYear}
          >
            <MenuItem value={null}>All</MenuItem>
            {academicYers?.map((ac) => (
              <MenuItem value={ac?.id}>{ac?.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-schoolClasses"> Class</InputLabel>
          <Select
            labelId="demo-simple-select-schoolClasses"
            id="demo-simple-select-schoolClasses"
            value={schoolClassesSelected}
            label="Class"
            onChange={handleChangeSchoolClass}
          >
            <MenuItem value={null}>All</MenuItem>
            {schoolClasses?.map((sc) => (
              <MenuItem value={sc?.id}>{sc?.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
