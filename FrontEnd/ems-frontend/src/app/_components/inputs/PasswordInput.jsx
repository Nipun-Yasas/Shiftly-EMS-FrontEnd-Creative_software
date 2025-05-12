"use client";

import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { useField } from "formik";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function PasswordInput({
  name,
  label,
  type = "text",
  ...props
}) {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      {...field}
      {...props}
      type={inputType}
      label={label}
      variant="standard"
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error ? meta.error : ""}
      fullWidth
      sx={{
        "& label": {
          color: "textblack.main",
        },
      }}
      slotProps={{
        input: {
          ...(type === "password" && {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }),
        },
      }}
    />
  );
}
