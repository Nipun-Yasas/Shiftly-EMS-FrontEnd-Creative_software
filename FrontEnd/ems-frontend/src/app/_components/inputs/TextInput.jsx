'use client'

import { TextField } from "@mui/material";
import { useField } from "formik";

export default function TextInput({ name, label, helperText, ...props }) {

  const [field, meta] = useField(name);

  // Determine what to show in helper text: error takes precedence, then custom helper text
  const displayHelperText = (meta.touched && meta.error) 
    ? meta.error 
    : helperText || "";

  return (
    <TextField
      {...field}
      {...props}
      label={label}
      autoComplete="off"
      variant="standard"
      error={Boolean(meta.touched && meta.error)}
      helperText={displayHelperText}
      fullWidth
      sx={{
        "& label": {
          color: "text.primary",
        },
      }}
    />
  );
}
