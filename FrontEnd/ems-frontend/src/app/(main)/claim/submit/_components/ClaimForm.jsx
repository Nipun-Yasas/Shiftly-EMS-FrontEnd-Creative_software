import { useRef, useState } from "react";

import { Formik, Form } from "formik";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import InputItem from "../../../../_components/inputs/InputItem";
import TextInput from "../../../../_components/inputs/TextInput";
import SelectInput from "../../../../_components/inputs/SelectInput";
import FileUpload from "../../../../_components/inputs/FileUpload";
import DateInput from "../../../../_components/inputs/DateInput";

const claimtypeOptions = [
  { id: 1, name: "Medical" },
  { id: 2, name: "Insuarance" },
];

export default function ClaimForm(props){
  const { setOpenSubmit } = props;

  const claimfileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

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
        onSubmit={(values, { resetForm }) => {
          setOpenSubmit(true);
          resetForm();
          setFileName("");
          setPreview(null);
          if (claimfileRef.current) {
            claimfileRef.current.value = "";
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
                    if (bannerRef.current) {
                      bannerRef.current.value = "";
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

