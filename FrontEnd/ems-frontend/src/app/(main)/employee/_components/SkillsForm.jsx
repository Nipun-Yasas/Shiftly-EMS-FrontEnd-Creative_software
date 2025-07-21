"use client";

import { Formik, Form } from "formik";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import InputItem from "@/app/_components/inputs/InputItem";
import TextInput from "@/app/_components/inputs/TextInput";
import SelectInput from "@/app/_components/inputs/SelectInput";

const proficiencyOptions = [
  { id: 1, name: "Beginner" },
  { id: 2, name: "Intermediate" },
  { id: 3, name: "Advanced" },
];

export default function SkillsForm(props) {
  const { formData, handleInputChange, handleSubmit, handleCancel } = props;

  return (
    <>
      <Formik
        initialValues={{
          skillName: formData?.skillName || "",
          proficiency: formData?.proficiency ? 
            proficiencyOptions.find(option => option.name === formData.proficiency) || null : null,
        }}
        validate={(values) => {
          const errors = {};
          if (!values.skillName) {
            errors.skillName = "Skill Name is required";
          }
          if (!values.proficiency) {
            errors.proficiency = "Proficiency Level is required";
          }
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          // Convert Formik values to the expected format for handleSubmit
          const syntheticEvent = {
            preventDefault: () => {},
            target: {
              elements: {
                skillName: { value: values.skillName },
                proficiency: { value: values.proficiency?.name || values.proficiency }
              }
            }
          };
          
          // Update formData through handleInputChange
          handleInputChange({ target: { name: 'skillName', value: values.skillName } });
          handleInputChange({ target: { name: 'proficiency', value: values.proficiency?.name || values.proficiency } });
          
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
                  <TextInput name="skillName" label="Skill Name (e.g., JavaScript)" />
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
                  <SelectInput
                    name="proficiency"
                    label="Proficiency Level"
                    options={proficiencyOptions}
                    getOptionLabel={(option) => option.name || ""}
                  />
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