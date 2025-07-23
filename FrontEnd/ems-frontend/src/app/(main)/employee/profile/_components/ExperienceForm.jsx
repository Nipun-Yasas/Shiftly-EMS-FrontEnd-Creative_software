"use client";

import { Formik } from "formik";
import { Form } from "formik";
import { useEffect, useState } from 'react';

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import InputItem from "@/app/_components/inputs/InputItem";
import TextInput from "@/app/_components/inputs/TextInput";

export default function ExperienceForm(props) {
  const { formData, handleInputChange, handleSubmit, handleCancel, existingExperiences, onAddExperience } = props;

  // Combine existing experiences into a single string (one per line)
  const initialExperienceText = (existingExperiences && existingExperiences.length > 0)
    ? existingExperiences.map(exp => exp.jobTitle || exp).join('\n')
    : '';

  return (
    <>
      <Formik
        initialValues={{
          experience: initialExperienceText,
        }}
        validate={(values) => {
          const errors = {};
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          // Split lines and trim
          const lines = values.experience.split('\n').map(line => line.trim()).filter(Boolean);
          // Get job titles from existingExperiences
          const existingTitles = (existingExperiences || []).map(exp => exp.jobTitle || exp);
          // Find new experiences (lines not in existing)
          const newTitles = lines.filter(line => !existingTitles.includes(line));
          if (newTitles.length > 0 && onAddExperience) {
            // Add each new experience as a new card
            newTitles.forEach(title => onAddExperience({ jobTitle: title }));
          }
          resetForm();
        }}
      >
        {({ validateForm, resetForm, values, setFieldValue }) => (
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
                  <TextInput
                    name="experience"
                    label="Experience"
                    multiline
                    rows={4}
                    placeholder="Describe your work experience, roles, responsibilities, etc. (one per line)"
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
                    handleCancel && handleCancel();
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