"use client";

import { Formik } from "formik";
import { Form } from "formik";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import InputItem from "@/app/_components/inputs/InputItem";
import TextInput from "@/app/_components/inputs/TextInput";

export default function EducationForm(props) {
  const { formData, handleInputChange, handleSubmit, handleCancel } = props;

  return (
    <>
      <Formik
        initialValues={{
          degree: formData?.degree || "",
          institution: formData?.institution || "",
          duration: formData?.duration || "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.degree) {
            errors.degree = "Degree is required";
          }
          if (!values.institution) {
            errors.institution = "Institution is required";
          }
          if (!values.duration) {
            errors.duration = "Duration is required";
          }
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
         
          const syntheticEvent = {
            preventDefault: () => {},
            target: {
              elements: {
                degree: { value: values.degree },
                institution: { value: values.institution },
                duration: { value: values.duration }
              }
            }
          };
          
          
          handleInputChange({ target: { name: 'degree', value: values.degree } });
          handleInputChange({ target: { name: 'institution', value: values.institution } });
          handleInputChange({ target: { name: 'duration', value: values.duration } });
          
          
          handleSubmit(syntheticEvent);
          resetForm();
        }}
      >
        {({ validateForm, resetForm }) => (
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
                  <TextInput name="degree" label="Degree (e.g., Bachelor of Science)" />
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
                  <TextInput name="institution" label="Institution" />
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
                  <TextInput name="duration" label="Duration (e.g., Jan 2020 - Dec 2022)" />
                </InputItem>
              </Box>

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
                    handleCancel();
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
                  Submit
                </Button>
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  );
}