import { useRef, useState, useEffect } from "react";

import { Formik, Form } from "formik";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import FileUpload from "../../../_components/inputs/FileUpload";
import DateInput from "../../../_components/inputs/DateInput";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";
import dayjs from "dayjs";
import * as Yup from "yup";

const claimtypeOptions = [
  { id: 1, name: "Medical" },
  { id: 2, name: "Insuarance" },
];

export default function ClaimForm({
  edit = false,
  onSubmit,
  onCancel,
  initialValues
}) {
  const claimfileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(initialValues?.claimfile || "");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Yup validation schema
  const validationSchema = Yup.object({
    claimtype: Yup.object().nullable().required("Select a claim type"),
    claimdate: Yup.date().typeError("Claim date is required").required("Claim date is required"),
    description: Yup.string().required("Description is required"),
    claimfile: Yup.mixed()
      .test("required", "Claim file is required", function (value) {
        const { edit } = this.options.context || {};
        if (edit) return true;
        return value !== null && value !== undefined;
      })
      .test("fileType", "Only PDF, JPEG, or PNG files are allowed", function (value) {
        if (!value) return true;
        if (!(value instanceof File)) return true;
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        return allowedTypes.includes(value.type);
      })
      .test("fileSize", "File must be less than 2MB", function (value) {
        if (!value) return true;
        if (!(value instanceof File)) return true;
        return value.size <= 2 * 1024 * 1024;
      }),
  });

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
      data.append('claimType', values.claimtype?.name || values.claimtype);
      data.append('description', values.description);
      if (values.claimdate) {
        data.append('claimDate', dayjs(values.claimdate).format('YYYY-MM-DD'));
      }
      if (values.claimfile) {
        data.append('file', values.claimfile);
      }

      const response = await axiosInstance.post(
        API_PATHS.CLAIMS.ADD,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // If we reach here, the request was successful
      showSnackbar('Claim submitted successfully', 'success');
      resetForm();
      setFileName("");
      setPreview(null);
      if (claimfileRef.current) {
        claimfileRef.current.value = "";
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Failed to submit claim.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues || {
          claimtype: "",
          claimdate: "",
          description: "",
          claimfile: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        context={{ edit }}
        enableReinitialize={edit}
      >
        {({ isSubmitting,validateForm, resetForm }) => (
          <Form>
            <Stack>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mx: 1,
                  my: 2,
                }}
              >
                <DateInput name="claimdate" label="Claim Date" disablePast={true}/>
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
                  <SelectInput
                    name="claimtype"
                    options={claimtypeOptions}
                    getOptionLabel={(option) => option.name || ""}
                    label="Claim type"
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
                    name="description"
                    label="Write a description"
                    multiline
                    minRows={1}
                    maxRows={3}
                    fullWidth
                  />
                </InputItem>
              </Box>

              <InputItem>
                <FileUpload
                  name="claimfile"
                  label="Upload claim"
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
                      if (claimfileRef.current) {
                        claimfileRef.current.value = "";
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
      {!edit && (
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
      )}
    </>
  );
};

