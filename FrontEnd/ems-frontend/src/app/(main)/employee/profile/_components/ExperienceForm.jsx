"use client";

import { Formik } from "formik";
import { Form } from "formik";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import InputItem from "@/app/_components/inputs/InputItem";
import TextInput from "@/app/_components/inputs/TextInput";

export default function ExperienceForm(props) {
  const { formData, handleInputChange, handleSubmit, handleCancel } = props;

  return (
    <>
      <Formik
        initialValues={{
          jobTitle: formData?.jobTitle || "",
          company: formData?.company || "",
          duration: formData?.duration || "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.jobTitle) {
            errors.jobTitle = "Job Title is required";
          }
          if (!values.company) {
            errors.company = "Company is required";
          }
          if (!values.duration) {
            errors.duration = "Duration is required";
          }
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          // Convert Formik values to the expected format for handleSubmit
          const syntheticEvent = {
            preventDefault: () => {},
            target: {
              elements: {
                jobTitle: { value: values.jobTitle },
                company: { value: values.company },
                duration: { value: values.duration }
              }
            }
          };
          
          // Update formData through handleInputChange
          handleInputChange({ target: { name: 'jobTitle', value: values.jobTitle } });
          handleInputChange({ target: { name: 'company', value: values.company } });
          handleInputChange({ target: { name: 'duration', value: values.duration } });
          
          // Call the original handleSubmit
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
                  <TextInput name="jobTitle" label="Job Title" />
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
                  <TextInput name="company" label="Company" />
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