'use client'

import { Autocomplete, TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";

export default function SelectInput({ name, options, getOptionLabel, label, onChange, ...props }) {
    
  const { setFieldValue, setFieldTouched, touched, errors, values } = useFormikContext();
  const [field] = useField(name);

  const handleChange = (e, selectedOption) => {
    setFieldValue(name, selectedOption);
    
    // Delay setting touched to prevent immediate validation
    setTimeout(() => {
      setFieldTouched(name, true, false);
    }, 100);
    
    // Call the custom onChange handler if provided
    if (onChange) {
      onChange(selectedOption);
    }
  };

  return (
    <Autocomplete
      {...props}
      id={name}
      options={options}
      getOptionLabel={getOptionLabel}
      value={values[name]}
      onChange={handleChange}
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
