"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";
import { notifyEventChange, EVENT_EVENTS } from "../../../_utils/eventUtils";
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

// Yup validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Event title must be at least 3 characters")
    .max(100, "Event title must be less than 100 characters")
    .required("Event title is required"),

  eventType: Yup.object().nullable().required("Event type is required"),

  enableDate: Yup.date()
    .nullable()
    .typeError("Please enter a valid date")
    .required("Start date is required"),

  expireDate: Yup.date()
    .nullable()
    .typeError("Please enter a valid date")
    .required("End date is required")
    .when("enableDate", {
      is: (enableDate) =>
        enableDate && enableDate instanceof Date && !isNaN(enableDate),
      then: (schema) =>
        schema.min(Yup.ref("enableDate"), "End date must be after start date"),
      otherwise: (schema) => schema,
    }),

  banner: Yup.mixed()
    .test(
      "fileType",
      "Only JPEG, JPG, and PNG files are allowed",
      function (value) {
        if (!value) return true; // Optional file
        if (!(value instanceof File)) return true; // Skip validation for existing URLs
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        return allowedTypes.includes(value.type);
      }
    )
    .test("fileSize", "File size must be less than 5MB", function (value) {
      if (!value) return true; // Optional file
      if (!(value instanceof File)) return true; // Skip validation for existing URLs
      return value.size <= 5 * 1024 * 1024; // 5MB
    }),
});

export default function EventForm({
  edit = false,
  onSubmit,
  onCancel,
  initialValues,
  redirectToHistory = false,
}) {
  const bannerRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(initialValues?.banner || "");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const router = useRouter();

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      if (onSubmit) {
        await onSubmit(values, { resetForm });
        return; // Exit early if parent handles submission
      }
      
      // Default submission logic (for create mode)
      const data = new FormData();
      data.append("title", values.title);
      data.append("eventType", values.eventType?.name || values.eventType);

      // Format dates properly
      const enableDate = values.enableDate
        ? new Date(values.enableDate).toISOString().slice(0, 10)
        : "";
      const expireDate = values.expireDate
        ? new Date(values.expireDate).toISOString().slice(0, 10)
        : "";

      data.append("enableDate", enableDate);
      data.append("expireDate", expireDate);

      if (values.banner) {
        data.append("image", values.banner);
      }

      const response = await axiosInstance.post(
        API_PATHS.EVENTS.ADD,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log('Event submission response:', response.data); // Debug log

      // If we reach here, the request was successful
      showSnackbar("Event submitted successfully!", "success");
      
      // Notify other tabs/windows about the new event
      console.log('Notifying event change...'); // Debug log
      notifyEventChange(EVENT_EVENTS.EVENT_SUBMITTED, response.data);
      
      resetForm();
      setFileName("");
      setPreview(null);
      if (bannerRef.current) {
        bannerRef.current.value = "";
      }

      // Optionally redirect to history page after successful submission
      if (redirectToHistory) {
        console.log('Redirecting to history page...'); // Debug log
        setTimeout(() => {
          router.push('/events/history?refresh=true');
        }, 1500); // Wait 1.5 seconds to show the success message
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to submit event.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues || {
          title: "",
          eventType: null,
          enableDate: null,
          expireDate: null,
          banner: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        context={{ edit }}
        enableReinitialize={edit}
      >
        {({ resetForm, isSubmitting, setFieldValue }) => (
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
                <DateInput
                  name="enableDate"
                  label="Event Start Date"
                  disablePast={true}
                />
                <DateInput
                  name="expireDate"
                  label="Event End Date"
                  disablePast={true}
                />
              </Box>
              <InputItem>
                <FileUpload
                  name="banner"
                  label="Upload Event Banner"
                  fileTypes=".jpg,.jpeg,.png"
                  fileName={fileName}
                  setFileName={setFileName}
                  preview={preview}
                  setPreview={setPreview}
                />
              </InputItem>

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
                    if (onCancel) {
                      onCancel();
                    } else {
                      resetForm();
                      setFileName("");
                      setPreview(null);
                      if (bannerRef.current) {
                        bannerRef.current.value = "";
                      }
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
          </Form>
        )}
      </Formik>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
