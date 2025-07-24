"use client";

import { useState, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";

import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { UserContext } from "../../../context/UserContext";
import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import DateInput from "../../../_components/inputs/DateInput";

// Work mode options
const workModeOptions = [
  { id: 1, name: "Online" },
  { id: 2, name: "On-site" },
  { id: 3, name: "Hybrid" },
];

// Yup validation schema
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
  mode = "create", // "create" or "edit"
  initialData = null,
  onSuccess = () => {},
  onCancel = () => {},
  showTitle = true,
  showSummary = true,
  showActions = true,
}) {
  const [message, setMessage] = useState({ text: "", type: "" });
  const { user } = useContext(UserContext);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  // Calculate overtime based on hours
  const calculateOvertime = (hours) => {
    const numHours = parseFloat(hours) || 0;
    return numHours > 8 ? (numHours - 8).toFixed(2) : "0.00";
  };

  // Calculate regular hours
  const calculateRegularHours = (hours) => {
    const numHours = parseFloat(hours) || 0;
    return numHours > 8 ? "8.00" : numHours.toFixed(2);
  };

  // Prepare initial values based on mode and data
  const getInitialValues = () => {
    if (mode === "edit" && initialData) {
      return {
        date: initialData.date
          ? dayjs(initialData.date).toISOString()
          : dayjs().toISOString(),
        workMode: initialData.workMode
          ? typeof initialData.workMode === "string"
            ? workModeOptions.find(
                (option) => option.name === initialData.workMode
              ) || null
            : initialData.workMode
          : null,
        activity: initialData.activity || "",
        hours: initialData.hours?.toString() || "",
      };
    }

    return {
      date: dayjs().toISOString(),
      workMode: null,
      activity: "",
      hours: "",
    };
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const dto = {
        userId: user?.id,
        date: dayjs(values.date).format("YYYY-MM-DD"),
        mode: values.workMode?.name || values.workMode,
        activity: values.activity,
        hours: parseFloat(values.hours),
      };

      if (mode === "edit" && initialData?.id) {
        dto.id = initialData.id;
        await axiosInstance.put(
          `${API_PATHS.TIMESHEETS.UPDATE}/${initialData.id}`,
          dto
        );
        showMessage("Timesheet updated successfully!", "success");
      } else {
        await axiosInstance.post(API_PATHS.TIMESHEETS.ADD, dto);
        showMessage("Timesheet submitted successfully!", "success");
        resetForm();
      }

      // Call success callback
      onSuccess(dto, mode);
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "submitting"} timesheet:`,
        error
      );
      const errorMsg =
        error.response?.data?.message ||
        `Error ${mode === "edit" ? "updating" : "submitting"} timesheet. Please try again.`;
      showMessage(errorMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (resetForm) => {
    resetForm();
    showMessage("Form reset successfully", "info");
    onCancel();
  };

  return (
    <>
      {showTitle && (
        <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
          {mode === "edit" ? "Edit Timesheet Entry" : "Daily Time Entry"}
        </Typography>
      )}

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, isSubmitting, resetForm }) => (
          <Form>
            <Stack spacing={3}>
              <InputItem sx={{ flex: 1 }}>
                <DateInput
                  name="date"
                  label="Select Date"
                  disablePast={mode === "create"}
                />
              </InputItem>

              {/* Work Mode and Hours */}
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

              {/* Activity Description */}
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

              {/* Action Buttons */}
              {showActions && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-end" },
                    pb: 2,
                    gap: 2,
                  }}
                >
                  <Button
                    color="text.primary"
                    type="button"
                    onClick={() => handleCancel(resetForm)}
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
                      ? mode === "edit"
                        ? "Updating..."
                        : "Submitting..."
                      : mode === "edit"
                        ? "Update Timesheet"
                        : "Submit Timesheet"}
                  </Button>
                </Box>
              )}
            </Stack>

            {/* Daily Summary */}
            {showSummary && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: "action.hover",
                  borderRadius: 1,
                }}
              >
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
            )}
          </Form>
        )}
      </Formik>

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!message.text}
        autoHideDuration={3000}
        onClose={() => setMessage({ text: "", type: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setMessage({ text: "", type: "" })}
          severity={message.type}
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </>
  );
}
