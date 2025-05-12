"use client";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useField, useFormikContext } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";

const DateInput = ({ name, label }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const locale = "en-gb";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <DatePicker
        label={label}
        value={field.value ? dayjs(field.value) : null}
        onChange={(date) => {
          if (dayjs.isDayjs(date) && date.isValid()) {
            setFieldValue(name, date.toISOString());
          } else {
            setFieldValue(name, "");
          }
        }}
        disablePast
        slotProps={{
          textField: {
            error: Boolean(meta.touched && meta.error),
            helperText: meta.touched && meta.error ? meta.error : "",
            variant: "outlined",
            sx: {
              "& label": {
                color: "textblack.main",
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DateInput;
