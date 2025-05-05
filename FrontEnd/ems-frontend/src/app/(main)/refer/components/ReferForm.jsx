"use client";

import { useRef, useState } from "react";

import { Formik, Form } from "formik";
import {
  Stack,
  Box,
  Button,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const vacancyOptions = [
  { id: 1, name: "Software Engineer" },
  { id: 2, name: "HR" },
];

const Item = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  textAlign: "center",
}));

export default function ReferForm(props) {
  
  const { setOpenSubmit } = props;

  const resumeRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  return (
    <>
      <Formik
        initialValues={{
          vacancy: null,
          applicantName: "",
          applicantEmail: "",
          message: "",
          resume: null,
        }}
        validate={(values) => {
          const errors = {};
          if (!values.vacancy) {
            errors.vacancy = "Vacancy is required";
          }
          if (!values.applicantName) {
            errors.applicantName = "Applicant name is required";
          }
          if (!values.applicantEmail) {
            errors.applicantEmail = "Applicant email is required";
          }
          if (!values.message) {
            errors.message = "Message is required";
          }
          if (!values.resume) {
            errors.resume = "resume is required";
          }
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          console.log("Submitted:", values);
          resetForm();
          setFileName("");
          setPreview(null);
          if (resumeRef.current) {
            resumeRef.current.value = "";
          }
        }}
      >
        {({
          errors,
          touched,
          setFieldTouched,
          setFieldValue,
          values,
          validateForm,
          isValid,
          resetForm,
        }) => (
          <Form>
            <Stack>
              <Item>
                <Autocomplete
                  id="vacancy"
                  options={vacancyOptions}
                  getOptionLabel={(option) => option.name || ""}
                  value={values.vacancy}
                  onChange={(e, selectedOption) => {
                    setFieldValue("vacancy", selectedOption);
                    setFieldTouched("vacancy", true, false);
                  }}
                  onBlur={() => setFieldTouched("vacancy", true, true)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vacancy"
                      variant="standard"
                      error={Boolean(errors.vacancy && touched.vacancy)}
                      helperText={
                        errors.vacancy && touched.vacancy ? errors.vacancy : ""
                      }
                      fullWidth
                      sx={{
                        "& label": {
                          color: "inputlabel.main",
                        },
                      }}
                    />
                  )}
                />
              </Item>

              <Item>
                <TextField
                  id="applicantName"
                  label="Enter Applicant name"
                  variant="standard"
                  value={values.applicantName}
                  onChange={(e) => {
                    setFieldValue("applicantName", e.target.value);
                    setFieldTouched("applicantName", true, false);
                  }}
                  onBlur={() => setFieldTouched("applicantName", true, true)}
                  error={Boolean(errors.applicantName && touched.applicantName)}
                  helperText={
                    errors.applicantName && touched.applicantName
                      ? errors.applicantName
                      : ""
                  }
                  fullWidth
                  sx={{
                    "& label": {
                      color: "inputlabel.main",
                    },
                  }}
                />
              </Item>
              <Item>
                <TextField
                  id="applicantEmail"
                  label="Enter Applicant email"
                  variant="standard"
                  value={values.applicantEmail}
                  onChange={(e) => {
                    setFieldValue("applicantEmail", e.target.value);
                    setFieldTouched("applicantEmail", true, false);
                  }}
                  onBlur={() => setFieldTouched("applicantEmail", true, true)}
                  error={Boolean(
                    errors.applicantEmail && touched.applicantEmail
                  )}
                  helperText={
                    errors.applicantEmail && touched.applicantEmail
                      ? errors.applicantEmail
                      : ""
                  }
                  fullWidth
                  sx={{
                    "& label": {
                      color: "inputlabel.main",
                    },
                  }}
                />
              </Item>

              <Item>
                <TextField
                  id="message"
                  label="Write a message"
                  variant="standard"
                  value={values.message}
                  multiline
                  rows={4}
                  fullWidth
                  onChange={(e) => {
                    setFieldValue("message", e.target.value);
                    setFieldTouched("message", true, false);
                  }}
                  onBlur={() => setFieldTouched("message", true, true)}
                  error={Boolean(errors.message && touched.message)}
                  helperText={
                    errors.message && touched.message ? errors.message : ""
                  }
                  sx={{
                    "& label": {
                      color: "inputlabel.main",
                    },
                  }}
                />
              </Item>

              <Item>
                <Box display="flex" justifyContent="center" width="100%">
                  {errors.resume && touched.resume && (
                    <Typography color="error" fontSize="0.875rem" mt={2} mx={2}>
                      {errors.resume}
                    </Typography>
                  )}
                  <Box width="50%">
                    <input
                      ref={resumeRef}
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFieldValue("resume", file);
                          setFileName(file.name);
                          const fileType = file.type;

                          if (fileType.startsWith("image/")) {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onloadend = () => {
                              setPreview({
                                type: "image",
                                url: reader.result,
                              });
                            };
                          } else if (fileType === "application/pdf") {
                            const url = URL.createObjectURL(file);
                            setPreview({ type: "pdf", url });
                          } else {
                            setPreview(null);
                          }
                        }
                      }}
                      style={{ display: "none" }}
                    />

                    <Item>
                      <label htmlFor="resume">
                        <Button
                          color="canclebtn"
                          variant="outlined"
                          component="span"
                          startIcon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                              />
                            </svg>
                          }
                          fullWidth
                          sx={{
                            borderColor:
                              errors.resume && touched.resume
                                ? "error.main"
                                : "grey.500",
                            px: 2,
                            py: 1.5,
                            textTransform: "none",
                          }}
                        >
                          Upload Resume
                        </Button>
                      </label>
                    </Item>
                  </Box>
                </Box>

                <Item>
                  {preview ? (
                    preview.type === "image" ? (
                      <Box
                        component="img"
                        src={preview.url}
                        alt="Resume Preview"
                        sx={{ width: "100%", height: 192, objectFit: "cover" }}
                      />
                    ) : preview.type === "pdf" ? (
                      <Box
                        component="iframe"
                        src={preview.url}
                        sx={{
                          width: "100%",
                          height: 192,
                          border: "1px solid #ccc",
                        }}
                        title="PDF Preview"
                      />
                    ) : null
                  ) : (
                    fileName && <p className="text-sm mt-1">{fileName}</p>
                  )}
                </Item>
              </Item>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  color="canclebtn"
                  type="reset"
                  onClick={() => {
                    resetForm();
                    setFileName("");
                    setPreview(null);
                    if (resumeRef.current) {
                      resumeRef.current.value = "";
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={Object.keys(errors).length > 0}
                  onClick={() => {
                    validateForm;
                    if (isValid) {
                      setOpenSubmit(true);
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  );
}
