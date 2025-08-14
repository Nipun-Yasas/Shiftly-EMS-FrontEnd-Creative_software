import { useRef, useState } from "react";

import * as Yup from "yup";

import { Formik, Form } from "formik";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import FileUpload from "../../../_components/inputs/FileUpload";
import DateInput from "../../../_components/inputs/DateInput";

const claimtypeOptions = [
  { id: 1, name: "Medical" },
  { id: 2, name: "Insuarance" },
];

const validationSchema = Yup.object({
  claimType: Yup.object({
    name: Yup.string().required(),
  })
    .nullable()
    .required("Select a claim type"),
  claimDate: Yup.string().required("Claim date is required"),
  description: Yup.string().required("Description is required"),
  file: Yup.mixed()
    .test("required", "Claim file is required", function (value) {
      const { edit } = this.options.context || {};
      if (edit) return true;
      return value !== null && value !== undefined;
    })
    .test(
      "fileType",
      "Only PDF, JPEG, or PNG files are allowed",
      function (value) {
        if (!value) return true;
        if (!(value instanceof File)) return true;
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        return allowedTypes.includes(value.type);
      }
    )
    .test("fileSize", "File must be less than 2MB", function (value) {
      if (!value) return true;
      if (!(value instanceof File)) return true;
      return value.size <= 2 * 1024 * 1024;
    }),
});

export default function ClaimForm({
  edit = false,
  handleSubmit,
  initialValues,
}) {
  const claimfileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(initialValues?.file || "");

  return (
    <Formik
      initialValues={
        initialValues || {
          claimType: null,
          description: "",
          file: null,
          claimDate: "",
        }
      }
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={edit}
      context={{ edit }}
      onReset={() => {
        setFileName("");
        setPreview(null);
        if (claimfileRef.current) {
          claimfileRef.current.value = "";
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form spacing={3} sx={{ m: 3 }}>
          <Stack>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mx: 1,
                my: 2,
              }}
            >
              <DateInput
                name="claimDate"
                label="Claim Date"
                disablePast={true}
              />
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
                  name="claimType"
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
              <InputItem>
                <FileUpload
                  name="file"
                  label="Upload claim"
                  fileName={fileName}
                  setFileName={setFileName}
                  preview={preview}
                  setPreview={setPreview}
                  inputRef={claimfileRef}
                />
              </InputItem>
            </InputItem>

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                pb: 2,
                gap: 2,
              }}
            >
              <Button color="text.primary" type="reset" disabled={isSubmitting}>
                Cancel
              </Button>

              <Button type="submit" variant="contained" disabled={isSubmitting}>
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
  );
}
