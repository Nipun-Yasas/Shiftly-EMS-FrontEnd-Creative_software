'use client'

import { Autocomplete, TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";

export default function SelectInput({ name, options, getOptionLabel, label, ...props }) {
    
  const { setFieldValue, setFieldTouched, touched, errors, values } = useFormikContext();
  const [field] = useField(name);

  return (
    <Autocomplete
      {...props}
      id={name}
      options={options}
      getOptionLabel={getOptionLabel}
      value={values[name]}
      onChange={(e, selectedOption) => {
        setFieldValue(name, selectedOption);
        setFieldTouched(name, true, false);
      }}
      onBlur={() => setFieldTouched(name, true, true)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="standard"
          error={Boolean(touched[name] && errors[name])}
          helperText={touched[name] && errors[name] ? errors[name] : ""}
          fullWidth
          sx={{
            "& label": {
              color: "text.secondary",
            },
          }}
        />
      )}
    />
  );
}
