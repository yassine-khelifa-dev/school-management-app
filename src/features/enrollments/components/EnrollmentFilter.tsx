import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import type { EnrollQueryType } from "../types";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import type { AcademicYearsType } from "../../academicYears/types";
import type { SchoolClassType } from "../../schoolClasses/types";
import TextField from "@mui/material/TextField";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Button } from "@mui/material";

type Props = {
  query: EnrollQueryType;
  academicYers: AcademicYearsType[];
  schoolClasses: SchoolClassType[];
  changeFilter: (field: keyof EnrollQueryType["filter"], value: string) => void;
  resetFilter: () => void;
};

export default function EnrollmentFilter({
  query,
  academicYers,
  schoolClasses,
  changeFilter,
  resetFilter,
}: Props) {
  const handleChangeAcademicYear = (event: SelectChangeEvent) => {
    changeFilter("academicYearSelected", event.target.value);
  };

  const handleChangeSchoolClass = (event: SelectChangeEvent) => {
    changeFilter("schoolClassesSelected", event.target.value);
  };

  return (
    <div
      style={{
        border: "blue 1px solid",
        padding: "13px",
        margin: "5px 0px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Filter</h3>

        <Button color="secondary" onClick={resetFilter} variant="contained">
          <RestartAltIcon />{" "}
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignContent: "end",
        }}
      >
        <TextField
          sx={{
            width: "50%",
          }}
          id="outlined-basic"
          label="Full Name"
          variant="outlined"
          value={query?.filter.search ?? ""}
          onChange={(e) => changeFilter("search", e.target.value)}
        />

        <FormControl>
          <FormLabel id="q_status">Status</FormLabel>
          <RadioGroup
            row
            aria-labelledby="q_status"
            name="row-radio-buttons-group"
            value={query.filter.status}
            onChange={(e) => changeFilter("status", e.target.value)}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />

            <FormControlLabel
              value="active"
              control={<Radio />}
              label="Active"
            />
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
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px 0px",
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-Academic">
            Academic Year
          </InputLabel>
          <Select
            labelId="demo-simple-select-Academic"
            id="demo-simple-select-Academic"
            value={query.filter.academicYearSelected ?? ""}
            label="Academic Year"
            onChange={handleChangeAcademicYear}
          >
            <MenuItem value="">All</MenuItem>
            {academicYers?.map((ac) => (
              <MenuItem key={ac.id} value={ac?.id}>
                {ac?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-schoolClasses"> Class</InputLabel>
          <Select
            labelId="demo-simple-select-schoolClasses"
            id="demo-simple-select-schoolClasses"
            value={query.filter.schoolClassesSelected ?? ""}
            label="Class"
            onChange={handleChangeSchoolClass}
          >
            <MenuItem value="">All</MenuItem>
            {schoolClasses?.map((sc) => (
              <MenuItem key={sc.id} value={sc?.id}>
                {sc?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
