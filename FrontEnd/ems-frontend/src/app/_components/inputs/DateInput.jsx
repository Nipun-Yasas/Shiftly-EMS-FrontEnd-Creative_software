"use client";

import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useField, useFormikContext } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";

const DateInput = ({ name, label, disablePast = false, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const locale = "en-gb";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <DesktopDatePicker
        label={label}
         sx={{
        "& label": {
          color: "text.primary",
        },
      }}
        value={field.value ? dayjs(field.value) : null}
        onChange={(date) => {
          if (dayjs.isDayjs(date) && date.isValid()) {
            setFieldValue(name, date.toISOString());
          } else {
            setFieldValue(name, "");
          }
        }}
        disablePast={disablePast}
        slotProps={{
          textField: {
            error: Boolean(meta.touched && meta.error),
            helperText: meta.touched && meta.error ? meta.error : "",
          },
          
        }}
      />
    </LocalizationProvider>
  );
};

export default DateInput;
