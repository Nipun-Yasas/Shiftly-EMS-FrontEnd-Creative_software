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

export default function ClaimForm({edit = false,
  onSubmit,
  onCancel,
  initialValues}) {
  const claimfileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
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
      .required("Claim file is required")
      .test("fileType", "Only PDF, JPEG, or PNG files are allowed", function (value) {
        if (!value) return false;
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        return allowedTypes.includes(value.type);
      })
      .test("fileSize", "File must be less than 2MB", function (value) {
        if (!value) return true;
        return value.size <= 2 * 1024 * 1024;
      }),
  });

  // Fetch claims by user ID on mount (example: userId = 2)
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.CLAIMS.GET_CLAIMS_BY_USER_ID(userId));
      } catch (error) {
      }
    };
    fetchClaims();
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          claimtype: "",
          claimdate: "",
          description: "",
          claimfile: null,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            setSubmitting(true);
            const data = new FormData();
            data.append('claimType', values.claimtype?.name || values.claimtype);
            data.append('description', values.description);
            if (values.claimdate) {
              data.append('claimDate', dayjs(values.claimdate).format('YYYY-MM-DD'));
            }
            if (values.claimfile) {
              data.append('file', values.claimfile);
            }
            // Optionally add status if needed
            // data.append('status', 'PENDING');

            const response = await axiosInstance.post(
              API_PATHS.CLAIMS.CREATE_CLAIM,
              data,
              { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            showSnackbar('Claim submitted successfully', 'success');
            resetForm();
            setFileName("");
            setPreview(null);
            if (claimfileRef.current) {
              claimfileRef.current.value = "";
            }
          } catch (error) {
            let errorMsg = 'Failed to submit claim.';
            if (error.response?.data?.message) {
              errorMsg = error.response.data.message;
            }
            showSnackbar(errorMsg, 'error');
          } finally {
            setSubmitting(false);
          }
        }}
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
                    resetForm();
                    setFileName("");
                    setPreview(null);
                    if (claimfileRef.current) {
                      claimfileRef.current.value = "";
                    }
                  }}
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
};

