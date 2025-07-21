"use client";

import { useRef, useState } from "react";
import { Formik, Form } from "formik";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";
import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import FileUpload from "../../../_components/inputs/FileUpload";
import DateInput from "../../../_components/inputs/DateInput";

const eventTypeOptions = [
  { id: 1, name: "Team Building" },
  { id: 2, name: "Corporate" },
  { id: 3, name: "Training" },
  { id: 4, name: "Social" },
  { id: 5, name: "Conference" },
  { id: 6, name: "Workshop" },
];

export default function EventForm(props) {
  const { setOpenSubmit } = props;

  const bannerRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log("Form values received:", values);
      
      // Map frontend form data to backend DTO format
      const eventData = {
        title: values.title,
        eventType: values.eventType?.name || values.eventType,
        enableDate: values.enableDate,
        expireDate: values.expireDate,
        createdBy: 1, // This should come from user context/auth
        fileName: values.fileName,
        filePath: values.filePath,
      };

      console.log("Sending to backend:", eventData);
      
      const response = await axiosInstance.post(API_PATHS.EVENTS.ADD_EVENT, eventData);
      console.log("Backend response:", response.data);
      
      showSnackbar("Event submitted successfully! Awaiting admin approval.", "success");
      setOpenSubmit(true);
      resetForm();
      setFileName("");
      setPreview(null);
      if (bannerRef.current) {
        bannerRef.current.value = "";
      }
      
    } catch (error) {
      console.error("Error creating event:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = "Failed to submit event";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid event data. Please check all required fields.";
      }
      
      showSnackbar(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          title: "",
          eventType: null,
          enableDate: null,
          expireDate: null,
          fileName: "",
          filePath: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.title) {
            errors.title = "Event title is required";
          }
          if (!values.eventType) {
            errors.eventType = "Event type is required";
          }
          if (!values.enableDate) {
            errors.enableDate = "Start date is required";
          }
          if (!values.expireDate) {
            errors.expireDate = "End date is required";
          }
          // Validate date range
          if (values.enableDate && values.expireDate) {
            if (new Date(values.expireDate) <= new Date(values.enableDate)) {
              errors.expireDate = "End date must be after start date";
            }
          }
          return errors;
        }}
        onSubmit={handleSubmit}
      >
        {({ validateForm, resetForm, isSubmitting }) => (
          <Form>
            <Stack spacing={3}>
              <InputItem>
                <TextInput name="title" label="Event Title" />
              </InputItem>

              <InputItem>
                <SelectInput
                  name="eventType"
                  label="Select Event Type"
                  options={eventTypeOptions}
                  getOptionLabel={(option) => option.name || ""}
                />
              </InputItem>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 0, sm: 2 },
                }}
              >
                <DateInput name="enableDate" label="Event Start Date" />
                <DateInput name="expireDate" label="Event End Date" />
              </Box>

              <FileUpload
                name="banner"
                label="Upload Event Banner (Optional)"
                fileTypes=".jpg,.jpeg,.png"
                fileName={fileName}
                setFileName={setFileName}
                preview={preview}
                setPreview={setPreview}
              />

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
                  type="reset"
                  onClick={() => {
                    resetForm();
                    setFileName("");
                    setPreview(null);
                    if (bannerRef.current) {
                      bannerRef.current.value = "";
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  onClick={() => {
                    validateForm();
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Event"}
                </Button>

              </Box>
            </Stack>
          </Form>
        )}
      </Formik>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
