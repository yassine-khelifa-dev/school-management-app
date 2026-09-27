import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import { getFilterOptions } from "../services/examService";
import type { ExamFilterType, ExamQueryType } from "../types";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
type Props = {
  changeFilter: (field: string, value: string) => void;
  query: ExamQueryType;
};

export default function ExamFilter({ changeFilter, query }: Props) {
  const [filterOptions, setFilterOptions] = useState<ExamFilterType>(null);

  useEffect(() => {
    const getData = async () => {
      const res = await getFilterOptions();
   //   console.log(res);
      setFilterOptions(res);
    };

    getData();
  }, []);

  return (
    <section className="filter-card">
      <div className="filter-card__header">
        <h2 className="filter-card__title"><FilterListRoundedIcon fontSize="small" /> Search & filter</h2>
      </div>

      <div className="filter-grid">
        <FormControl
          style={{
            width: "100%",
          }}
        >
          <InputLabel id="in-selectAcademicYear">Academic Year</InputLabel>
          <Select
            labelId="selectAcademicYear"
            id="selectAcademicYear"
            value={query?.filtre.academic_year ?? ""}
            name="academic_year"
            label="selectAcademicYear"
            onChange={(e) => changeFilter(e.target.name, "" + e.target.value)}
          >
            <MenuItem value="">Select...</MenuItem>
            {filterOptions?.academicYers?.map((option) => (
              <MenuItem  key={option.id} value={String(option.id)}>{option.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          style={{
            width: "100%",
          }}
        >
          <InputLabel id="in-selectClass">Class</InputLabel>
          <Select
            labelId="selectClass"
            id="selectClass"
            value={query?.filtre.school_class ?? ""}
            name="school_class"
            label="selectClass"
            onChange={(e) => changeFilter(e.target.name, "" + e.target.value)}
          >
            <MenuItem value="">Select...</MenuItem>
            {filterOptions?.classes?.map((option) => (
              <MenuItem  key={option.id} value={String(option.id)}>{option.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          style={{
            width: "100%",
          }}
        >
          <InputLabel id="in-selectSubject">Subject</InputLabel>
          <Select
            labelId="selectSubject"
            id="selectSubject"
            value={query?.filtre.subject ?? ""}
            name="subject"
            label="selectSubject"
            onChange={(e) => changeFilter(e.target.name, "" + e.target.value)}
          >
            <MenuItem value="">Select...</MenuItem>
            {filterOptions?.subjects?.map((option) => (
              <MenuItem key={option.id}  value={String(option.id)}>{option.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="filter-grid filter-grid--two">
        <FormControl
          style={{
            width: "100%",
          }}
        >
          <InputLabel id="in-q_field_sortedr">Sort by</InputLabel>
          <Select
            labelId="q_field_sorted"
            id="q_field_sorted"
            value={query?.filtre.q_field_sorted ?? ""}
            name="q_field_sorted"
            label="q_field_sorted"
            onChange={(e) => changeFilter(e.target.name, e.target.value)}
          >
            <MenuItem value="">Select...</MenuItem>
            <MenuItem  value="title_exam">Title</MenuItem>
            <MenuItem value="exam_date">Date</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          style={{
            width: "100%",
          }}
        >
          <InputLabel id="in-q_dir_sorted">Sort direction</InputLabel>
          <Select
            labelId="q_dir_sorted"
            id="q_dir_sorted"
            value={query?.filtre.q_dir_sorted ?? ""}
            name="q_dir_sorted"
            label="q_dir_sorted"
            onChange={(e) => changeFilter(e.target.name, e.target.value)}
          >
            <MenuItem value="asc">ASC</MenuItem>
            <MenuItem value="desc">Desc</MenuItem>
          </Select>
        </FormControl>
      </div>
    </section>
  );
}
