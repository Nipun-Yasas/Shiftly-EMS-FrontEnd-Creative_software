import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export default function SearchField({
  placeholder,
  value,
  onChange,
  size = "small",
  variant = "outlined",
  fullWidth = false,
  sx = {},
  showIcons = true,
  ...props
}) {
  const handleClear = () => {
    if (onChange) {
      onChange({ target: { value: "" } });
    }
  };

  return (
    <TextField
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      sx={sx}
      slotProps={{
        input: {
          startAdornment: showIcons && (
            <InputAdornment position="start">
              <Box sx={{ display: { xs: "block", sm: "none", md: "none", lg: "block" } }}>
                <IconButton type="button" aria-label="search" size="small">
                  <SearchIcon />
                </IconButton>
              </Box>
            </InputAdornment>
          ),
          endAdornment: showIcons && value && (
            <InputAdornment position="end">
              <Box sx={{ display: { xs: "block", sm: "none", md: "none", lg: "block" } }}>
                <IconButton
                  size="small"
                  onClick={handleClear}
                  aria-label="clear search"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
}