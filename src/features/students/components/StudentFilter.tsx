import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import type { StudentQueryType } from "../types";
import React from "react";

type Props = {
  onQueryChange: React.Dispatch<React.SetStateAction<StudentQueryType>>;
  value: StudentQueryType;
};

export default function StudentFilter({ onQueryChange, value }: Props) {
  return (
    <Paper
      component="form"
      sx={{
        p: "px 4px",
        display: "flex",
        m: "10px 0px",
        alignItems: "center",
        width: "100%",
      }}
    >
      <h4 style={{ paddingLeft: "5px" }}>Filter</h4>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search by first name or last name"
        inputProps={{ "aria-label": "search google maps" }}
        onChange={(e) => {
          onQueryChange({ ...value, fullname: e.target.value, page: 1 });
        }}
        value={value?.fullname}
      />
      <SearchIcon
        sx={{
          p: "0px 10px",
        }}
      />
    </Paper>
  );
}
