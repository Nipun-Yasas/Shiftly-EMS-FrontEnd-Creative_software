'use client'

import { TextField } from "@mui/material";
import { useField } from "formik";

export default function TextInput({ name, label, ...props }) {

  const [field, meta] = useField(name);

  return (
    <TextField
      {...field}
      {...props}
      label={label}
      variant="standard"
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error ? meta.error : ""}
      fullWidth
      sx={{
        "& label": {
          color: "text.secondary",
        },
      }}
    />
  );
}
