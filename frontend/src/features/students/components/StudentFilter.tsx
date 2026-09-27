import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import type { StudentQueryType } from "../types";
import React from "react";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

type Props = {
  onQueryChange: React.Dispatch<React.SetStateAction<StudentQueryType>>;
  value: StudentQueryType;
};

export default function StudentFilter({ onQueryChange, value }: Props) {
  return (
    <section className="filter-card">
      <div className="filter-card__header">
        <h2 className="filter-card__title"><FilterListRoundedIcon fontSize="small" /> Search & filter</h2>
      </div>
      <Paper
        component="form"
        className="filter-search"
        elevation={0}
      >
        <SearchIcon />
        <InputBase
          sx={{ ml: 1.5, flex: 1 }}
          placeholder="Search by first name or last name"
          inputProps={{ "aria-label": "Search students" }}
          onChange={(e) => {
            onQueryChange({ ...value, fullname: e.target.value, page: 1 });
          }}
          value={value?.fullname}
        />
      </Paper>
    </section>
  );
}
