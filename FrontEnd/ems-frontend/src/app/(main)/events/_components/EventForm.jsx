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
      const data = new FormData();
      data.append('title', values.title);
      data.append('eventType', values.eventType?.name || values.eventType);
      data.append('enableDate', values.enableDate?.slice(0, 10)); // send only YYYY-MM-DD
      data.append('expireDate', values.expireDate?.slice(0, 10)); // send only YYYY-MM-DD
      // If you want to send status, add it here (optional)
      // data.append('status', values.status || 'PENDING');
      if (values.banner) {
        data.append('image', values.banner); // Use 'image' as the field name!
      }

      const response = await axiosInstance.post(
        API_PATHS.EVENTS.ADD_EVENT,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      showSnackbar('Event submitted! ID: ' + response.data.id, 'success');
      resetForm();
      setFileName("");
      setPreview(null);
      if (bannerRef.current) {
        bannerRef.current.value = "";
      }
    } catch (error) {
      let errorMsg = 'Failed to submit event.';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      showSnackbar(errorMsg, 'error');
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
          banner: null,
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
        {({ validateForm, resetForm, isSubmitting, setFieldValue }) => (
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
                onChange={(file) => setFieldValue('banner', file)}
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
