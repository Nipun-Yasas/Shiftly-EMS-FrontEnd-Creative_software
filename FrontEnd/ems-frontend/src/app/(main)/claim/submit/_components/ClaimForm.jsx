import { useRef, useState, useEffect } from "react";

import { Formik, Form } from "formik";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import InputItem from "../../../../_components/inputs/InputItem";
import TextInput from "../../../../_components/inputs/TextInput";
import SelectInput from "../../../../_components/inputs/SelectInput";
import FileUpload from "../../../../_components/inputs/FileUpload";
import DateInput from "../../../../_components/inputs/DateInput";

import { API_PATHS } from "../../../../_utils/apiPaths";
import axiosInstance from "../../../../_utils/axiosInstance";
import dayjs from "dayjs";

const claimtypeOptions = [
  { id: 1, name: "Medical" },
  { id: 2, name: "Insuarance" },
];

export default function ClaimForm(props){
  const { setOpenSubmit } = props;

  const claimfileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  // Fetch claims by user ID on mount (example: userId = 2)
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const userId = 2; // Replace with dynamic user ID as needed
        const response = await axiosInstance.get(API_PATHS.CLAIMS.GET_CLAIMS_BY_USER_ID(userId));
        console.log("Claims for user", userId, response.data);
      } catch (error) {
        console.error("Failed to fetch claims by user ID:", error);
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
        validate={(values) => {
          const errors = {};
          if (!values.claimtype) {
            errors.claimtype = "Select a claim type";
          }
          if (!values.claimdate) {
            errors.claimdate = "Claim date name is required";
          }
          if (!values.description) {
            errors.description = "Description is required";
          }
          if (!values.claimfile) {
            errors.claimfile = "Claim file is required";
          }
          return errors;
        }}
        onSubmit={async (values, { resetForm }) => {
          try {
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
            alert('Claim submitted! ID: ' + response.data.id);
            setOpenSubmit(true);
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
            alert(errorMsg);
          }
        }}
      >
        {({ validateForm, resetForm }) => (
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
                <DateInput name="claimdate" label="Claim Date" />
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
                  onClick={() => {
                    validateForm();
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
};

