"use client";

import React from "react";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  return (
    <Autocomplete
      freeSolo
      options={[]}
      sx={{
        width: 402,
        bgcolor: "rgb(243, 246, 249)",
        borderRadius: "16px",
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "16px",
              "& fieldset": { border: "1px solid rgb(224, 230, 237)" },
            },
          }}
        />
      )}
    />
  );
};

export default SearchBar;