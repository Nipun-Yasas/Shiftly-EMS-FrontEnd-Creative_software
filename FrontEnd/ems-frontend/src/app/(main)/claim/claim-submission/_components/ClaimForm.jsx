import { useRef, useState } from "react";

import { Formik, Form } from "formik";

import { Stack, Box, Button } from "@mui/material";

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
          console.log("Submitted:", values);
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

              <InputItem>
                <SelectInput
                  name="claimtype"
                  options={claimtypeOptions}
                  getOptionLabel={(option) => option.name || ""}
                  label="Claim type"
                />
              </InputItem>

              <Box sx={{ display: "flex", justifyContent: "space-between", mx: 1,my:2 }}>
                <DateInput name="claimdate" label="Claim Date" />
              </Box>
              
              
                
              <InputItem>
                <TextInput
                  name="description"
                  label="Write a description"
                  multiline
                  rows={4}
                />
              </InputItem>

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

              <InputItem>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button
                    color="canclebtn"
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
                    onClick={() => {
                      validateForm();
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </InputItem>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  );
};

