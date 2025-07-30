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
      const { edit } = this.options.context || {};
      if (edit) return true;
      return value !== null && value !== undefined;
    })
    .test("fileType", "Only JPEG and PDF files are allowed", function (value) {
      if (!value) return true;
      if (!(value instanceof File)) return true;
      const allowedTypes = ["application/pdf", "image/jpeg"];
      return allowedTypes.includes(value.type);
    })
    .test("fileSize", "PDF files must be less than 1MB", function (value) {
      if (!value) return true;
      if (!(value instanceof File)) return true;
      if (value.type === "application/pdf") {
        return value.size <= 1 * 1024 * 1024;
      }
      return true;
    }),
});

export default function ReferForm({
  edit = false,
  onSubmit,
  onCancel,
  initialValues,
}) {
  const resumeRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(initialValues?.resume || "");
  const { vacancies, loading: vacanciesLoading } = useVacancies();
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
        await onSubmit(values, { resetForm });
      }

      const formData = new FormData();
      formData.append("vacancyId", values.vacancy?.id || values.vacancy);
      formData.append("applicantName", values.applicantName);
      formData.append("applicantEmail", values.applicantEmail);
      formData.append("message", values.message);
      if (values.resume) {
        formData.append("file", values.resume);

        const response = await axiosInstance.post(
          API_PATHS.REFERRALS.ADD,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          showSnackbar("Referral submitted successfully!", "success");
          resetForm();
          setFileName("");
          setPreview(null);
          if (resumeRef.current) {
            resumeRef.current.value = "";
          }
        }
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
        context={{ edit }}
      >
        {({ isSubmitting, resetForm }) => (
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
                  />
                </InputItem>
              </Box>

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
                        onCancel();
                      } else {
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
                      ? edit
                        ? "Updating..."
                        : "Submitting..."
                      : edit
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
        autoHideDuration={500}
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
