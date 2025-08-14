"use client";

import { useRef, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import FileUpload from "../../../_components/inputs/FileUpload";

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

  file: Yup.mixed()
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
  vacancies,
  edit = false,
  handleSubmit,
  initialValues,
}) {
  const resumeRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(initialValues?.file || "");


  return (
    
      <Formik
        initialValues={
          initialValues || {
            vacancy: null,
            applicantName: "",
            applicantEmail: "",
            message: "",
            file: null,
          }
        }
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        context={{ edit }}
        onReset={() => {
        setFileName("");
        setPreview(null);
        if (resumeRef.current) {
          resumeRef.current.value = "";
        }
      }}
      >
        {({ isSubmitting}) => (
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
                    label="Select a Vacancy"
                    options={vacancies}
                    getOptionLabel={(option) => option.vacancyName || ""}
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
                  name="file"
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
  );
}
