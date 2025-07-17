"use client";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ label }) {
  return (
    <Box sx={{ display: { xs: "none", sm: "inline", md: "inline" } }}>
      <Tooltip title="Search" enterDelay={1000}></Tooltip>
      <TextField
        label={label}
        size="small"
        color="primary"
        slotProps={{
          input: {
            endAdornment: (
              <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
                <IconButton type="button" aria-label="search" size="small">
                  <SearchIcon />
                </IconButton>
              </Box>
            ),
            sx: { pr: 0.5 },
          },
        }}
      />
    </Box>
  );
}
