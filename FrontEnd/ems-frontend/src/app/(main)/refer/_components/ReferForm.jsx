"use client";

import { useRef, useState } from "react";

import { Formik, Form } from "formik";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import FileUpload from "../../../_components/inputs/FileUpload";
import axiosInstance from '../../../_utils/axiosInstance';
import { API_PATHS } from '../../../_utils/apiPaths';
import { useVacancies } from '../../../_hooks/useVacancies';

export default function ReferForm(props) {
  const { initialValues, onSubmit, isEditMode = false } = props;

  const resumeRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(initialValues?.resume || "");
  const [submitting, setSubmitting] = useState(false);
  const { vacancies, loading: vacanciesLoading } = useVacancies();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // New: handle backend submission
  const handleBackendSubmit = async (values, { resetForm }) => {
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('vacancyId', values.vacancy?.id || '');
      data.append('applicantName', values.applicantName);
      data.append('applicantEmail', values.applicantEmail);
      data.append('message', values.message);
      if (values.resume) {
        data.append('file', values.resume);
      }
      const response = await axiosInstance.post(API_PATHS.REFERRALS.ADD, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showSnackbar('Referral submitted! ID: ' + response.data.id, 'success');
      resetForm();
      setFileName("");
      setPreview(null);
      if (resumeRef.current) {
        resumeRef.current.value = "";
      }
    } catch (error) {
      showSnackbar('Failed to submit referral.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues || {
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
        onSubmit={handleBackendSubmit}
      >
        {({ errors, validateForm, resetForm }) => (
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
                  label={vacanciesLoading ? "Loading vacancies..." : "Vacancy"}
                  disabled={vacanciesLoading}
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
                <TextInput name="applicantName" label="Enter applicant name" />
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
                    pb:2,
                  }}
                >
                  <Button
                    color="text.primary"
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
                    variant="contained"
                    // disabled={Object.keys(errors).length > 0}
                    onClick={() => {
                      validateForm();
                    }}
                  >
                    {isEditMode ? "Update" : "Submit"}
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
