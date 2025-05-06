'use client';

import { useField } from "formik";
import { Checkbox, FormControlLabel } from "@mui/material";

const CustomCheckBox = ({ label, ...props }) => {
  const [field] = useField({ ...props, type: "checkbox" });

  return (
    <FormControlLabel
      sx={{ display: "flex", justifyContent: "flex-start",m:0,p:0 }}
      control={<Checkbox {...field} checked={field.value} />}
      label={label}
    />
  );
};

export default CustomCheckBox;

