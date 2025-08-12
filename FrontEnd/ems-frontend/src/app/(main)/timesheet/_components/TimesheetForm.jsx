"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";

import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import DateInput from "../../../_components/inputs/DateInput";

const workModeOptions = [
  { id: 1, name: "Online" },
  { id: 2, name: "On-site" },
  { id: 3, name: "Hybrid" },
];

const validationSchema = Yup.object({
  date: Yup.string().required("Date is required"),

  workMode: Yup.object().nullable().required("Work mode is required"),

  activity: Yup.string()
    .min(10, "Activity description must be at least 10 characters")
    .max(500, "Activity description must be less than 500 characters")
    .required("Activity description is required"),

  hours: Yup.number()
    .min(4, "Minimum hours per day is 4 hours")
    .max(15, "Maximum hours per day is 15 hours")
    .required("Hours is required")
    .test(
      "decimal",
      "Hours must be a valid number with up to 2 decimal places",
      function (value) {
        if (value === undefined || value === null) return false;
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      }
    ),
});

export default function TimesheetForm({
  edit = false,
  handleSubmit,
  initialValues,
}) {
  const calculateOvertime = (hours) => {
    const numHours = parseFloat(hours) || 0;
    return numHours > 8 ? (numHours - 8).toFixed(2) : "0.00";
  };

  const calculateRegularHours = (hours) => {
    const numHours = parseFloat(hours) || 0;
    return numHours > 8 ? "8.00" : numHours.toFixed(2);
  };

  return (
    <>
      <Formik
        initialValues={
          initialValues || {
            date: "",
            mode: "",
            activity: "",
            hours: "",
          }
        }
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, resetForm }) => (
          <Form>
            <Stack spacing={3} sx={{ m: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <DateInput name="date" label="Select Date" />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 0, sm: 2 },
                }}
              >
                <InputItem sx={{ flex: 1 }}>
                  <SelectInput
                    name="workMode"
                    label="Work Mode"
                    options={workModeOptions}
                    getOptionLabel={(option) => option.name || ""}
                  />
                </InputItem>

                <InputItem sx={{ flex: 1 }}>
                  <TextInput
                    name="hours"
                    label="Hours"
                    type="number"
                    inputProps={{
                      min: 4,
                      max: 15,
                      step: 0.25,
                      style: { textAlign: "center" },
                    }}
                    helperText="Enter hours worked (4-15 hours)"
                  />
                </InputItem>
              </Box>

              <Box>
                <InputItem>
                  <TextInput
                    name="activity"
                    label="Activity (Brief Description)"
                    multiline
                    rows={3}
                    helperText="Provide a brief description of your work activities (minimum 10 characters)"
                  />
                </InputItem>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                  gap: 2,
                }}
              >
                <Button
                  color="text.primary"
                  type="button"
                  onClick={() => resetForm()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? edit
                      ? "Updating..."
                      : "Submitting..."
                    : edit
                      ? "Update"
                      : "Submit"}
                </Button>
              </Box>
            </Stack>
            <Box sx={{ m: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Daily Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Date:{" "}
                    <strong>
                      {values.date
                        ? dayjs(values.date).format("MMM DD, YYYY (dddd)")
                        : "Select date"}
                    </strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Regular Hours:{" "}
                    <strong>{calculateRegularHours(values.hours)}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Overtime Hours:{" "}
                    <strong style={{ color: "#f57c00" }}>
                      {calculateOvertime(values.hours)}
                    </strong>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}
