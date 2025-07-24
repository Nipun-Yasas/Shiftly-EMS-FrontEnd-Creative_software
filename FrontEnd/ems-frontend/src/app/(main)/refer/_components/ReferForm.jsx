"use client";

import { useRef, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import FileUpload from "../../../_components/inputs/FileUpload";
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { useVacancies } from "../../../_hooks/useVacancies";

// Yup validation schema
const validationSchema = Yup.object({
  vacancy: Yup.object().nullable().required("Vacancy is required"),

  applicantName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Applicant name is required"),

  applicantEmail: Yup.string()
    .email("Please enter a valid email address")
    .required("Applicant email is required"),

  message: Yup.string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters")
    .required("Message is required"),

  resume: Yup.mixed()
    .test("required", "Resume is required", function (value) {
      const { isEditMode } = this.options.context || {};
      if (isEditMode) return true; // Skip validation in edit mode
      return value !== null && value !== undefined;
    })
    .test("fileType", "Only JPEG and PDF files are allowed", function (value) {
      if (!value) return true; // Skip if no file (will be caught by required test)
      const allowedTypes = ["application/pdf", "image/jpeg"];
      return allowedTypes.includes(value.type);
    })
    .test("fileSize", "PDF files must be less than 1MB", function (value) {
      if (!value) return true; // Skip if no file
      if (value.type === "application/pdf") {
        return value.size <= 1 * 1024 * 1024; // 1MB for PDF
      }
      return true; // No size limit for JPEG
    }),
});

export default function ReferForm(props) {
  const { initialValues, onSubmit, isEditMode = false, setOpenSubmit, onCancel } = props;

  const resumeRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(initialValues?.resume || "");
  const { vacancies, loading: vacanciesLoading } = useVacancies();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      
      if (onSubmit) {
        // If parent provides onSubmit, use it
        await onSubmit(values, { setSubmitting, resetForm });
      } else {
        // Default submission logic
        if (!values.resume) {
          showSnackbar("Please select a resume file before submitting.", "error");
          return;
        }

        const formData = new FormData();
        formData.append('vacancyId', values.vacancy?.id || values.vacancy);
        formData.append('applicantName', values.applicantName);
        formData.append('applicantEmail', values.applicantEmail);
        formData.append('message', values.message);
        if (values.resume) {
          formData.append('file', values.resume); // Backend expects 'file' parameter
        }

        console.log('Submitting FormData:');
        console.log('vacancyId:', values.vacancy?.id || values.vacancy);
        console.log('applicantName:', values.applicantName);
        console.log('applicantEmail:', values.applicantEmail);
        console.log('message:', values.message);
        console.log('file:', values.resume);
        console.log('file name:', values.resume?.name);
        console.log('file size:', values.resume?.size);
        console.log('file type:', values.resume?.type);

        // Log FormData contents (for debugging)
        console.log('FormData entries:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ', pair[1]);
        }

        const response = await axiosInstance.post(API_PATHS.REFERRALS.ADD, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200 || response.status === 201) {
          console.log('Referral submission successful:', response.data);
          showSnackbar("Referral submitted successfully!", "success");
          resetForm();
          setFileName("");
          setPreview(null);
          if (resumeRef.current) {
            resumeRef.current.value = "";
          }
          // Open submit dialog if provided
          if (setOpenSubmit) {
            setTimeout(() => setOpenSubmit(true), 500);
          }
        } else {
          console.log('Unexpected response status:', response.status);
          showSnackbar("Unexpected response from server", "warning");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);
      
      let errorMessage = "Failed to submit referral. Please try again.";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      showSnackbar(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Pure presentational form: onSubmit is handled by parent
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={
          initialValues || {
            vacancy: null,
            applicantName: "",
            applicantEmail: "",
            message: "",
            resume: null,
          }
        }
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        context={{ isEditMode }} // Pass isEditMode to validation context
      >
        {({ isSubmitting, resetForm, setFieldValue }) => (
          <Form>
            <Stack>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 0, sm: 2 },
                }}
              >
                <InputItem>
                  <SelectInput
                    name="vacancy"
                    options={vacancies}
                    getOptionLabel={(option) => option.name || ""}
                    label={
                      vacanciesLoading ? "Loading vacancies..." : "Vacancy"
                    }
                    disabled={vacanciesLoading}
                  />
                </InputItem>
                 <InputItem>
                  <TextInput
                    name="applicantName"
                    label="Enter applicant name"
                    helperText="Full name of the person you're referring"
                  />
                </InputItem>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 0, sm: 2 },
                }}
              >
                <InputItem>
                  <TextInput
                    name="applicantEmail"
                    label="Enter applicant email"
                    helperText="Valid email address of the applicant"
                  />
                </InputItem>
               
              </Box>

              

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 0, sm: 2 },
                }}
              >
                <InputItem>
                  <TextInput
                    name="message"
                    label="Write a message"
                    multiline
                    minRows={1}
                    maxRows={4}
                    helperText="Write a message to about the applicant"
                  />
                </InputItem>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 0, sm: 2 },
                }}
              >
                <InputItem>
                  <FileUpload
                    name="resume"
                    label="Upload Resume"
                    fileTypes=".pdf,.jpg,.jpeg"
                    fileName={fileName}
                    setFileName={setFileName}
                    preview={preview}
                    setPreview={setPreview}
                  />
                </InputItem>
              </Box>

              <InputItem>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-end" },
                    gap: 2,
                  }}
                >
                  <Button
                    color="text.primary"
                    type="reset"
                    onClick={() => {
                      if (onCancel) {
                        // If in edit mode or dialog, close the dialog
                        onCancel();
                      } else {
                        // Default behavior: reset form
                        resetForm();
                        setFileName("");
                        setPreview(null);
                        if (resumeRef.current) {
                          resumeRef.current.value = "";
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
                      ? isEditMode
                        ? "Updating..."
                        : "Submitting..."
                      : isEditMode
                        ? "Update"
                        : "Submit"}
                  </Button>
                </Box>
              </InputItem>
            </Stack>
          </Form>
        )}
      </Formik>
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
