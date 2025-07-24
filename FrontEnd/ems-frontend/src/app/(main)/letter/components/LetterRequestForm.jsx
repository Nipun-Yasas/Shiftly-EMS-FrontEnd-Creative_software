'use client';

import React from 'react';
import { Formik, Form } from "formik";
import {
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Stack,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { ArrowBack, Send } from '@mui/icons-material';
import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import DateInput from "../../../_components/inputs/DateInput";
import { letterTypes, fieldTypeSpecifications } from '../letterTypes';

const LetterRequestForm = ({ letterType, onBack, onGenerate }) => {
  const theme = useTheme();

  // Find the config for the selected letter type
  const currentLetterConfig = letterTypes.find(l => l.name === letterType) || letterTypes.find(l => l.name === 'Default');

  // Render input field based on type
  const renderField = (field) => {
    const spec = fieldTypeSpecifications[field.type] || fieldTypeSpecifications.text;
    const Component = spec.component === "TextInput" ? TextInput : DateInput;
    return (
      <InputItem key={field.name}>
        <Component
          name={field.name}
          label={field.label}
          required={field.required}
          {...spec.properties}
          placeholder={`Enter ${field.label.toLowerCase()}...`}
        />
      </InputItem>
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', px: 2, mt: 3 }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
        
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={onBack}
            sx={{
              mr: 2,
              color: theme.palette.text,
              '&:hover': { backgroundColor: `${theme.palette.primary.main}20` }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                fontFamily: 'var(--font-poppins)'
              }}
            >
              {letterType}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text}}
            >
              Please fill in the required information to generate your letter
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Form */}
      <Formik
        initialValues={currentLetterConfig.initialValues}
        validate={(values) => {
          const errors = {};
          currentLetterConfig.fields.forEach(field => {
            const value = values[field.name];
            if (field.required && (!value || value.toString().trim() === '')) {
              errors[field.name] = `${field.label} is required`;
            }
            // Email format validation
            if (field.name.toLowerCase().includes('email') && value) {
              if (!/^\S+@\S+\.\S+$/.test(value)) {
                errors[field.name] = 'Invalid email format';
              }
            }
            // Textarea min/max length validation
            if (field.type === 'textarea' && value) {
              if (value.length < 10) {
                errors[field.name] = `${field.label} must be at least 10 characters`;
              } else if (value.length > 300) {
                errors[field.name] = `${field.label} must be at most 300 characters`;
              }
            }
            // Salary numeric/positive validation (only for currentSalary)
            if (field.name === 'currentSalary' && value) {
              if (isNaN(Number(value))) {
                errors[field.name] = `${field.label} must be a number`;
              } else if (Number(value) <= 0) {
                errors[field.name] = `${field.label} must be greater than 0`;
              } else if (Number(value) > 10000000) {
                errors[field.name] = `${field.label} is unrealistically high`;
              }
            }
            // joinDate must be a past date
            if (field.name === 'joinDate' && value) {
              const today = new Date();
              today.setHours(0,0,0,0);
              const joinDate = new Date(value);
              if (joinDate >= today) {
                errors[field.name] = `${field.label} must be a past date`;
              }
            }
          });
          return errors;
        }}
        onSubmit={(values) => {
          onGenerate({ letterType, formData: values });
        }}
      >
        {({ validateForm, values, isValid }) => (
          <Form>
            <Stack spacing={3}>
              <Card elevation={1} sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    {currentLetterConfig.fields.map(renderField)}
                  </Stack>
                </CardContent>
              </Card>
              {/* Submit Section */}
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.text,
                      mb: 1
                    }}
                  >
                    Ready to Generate Your Letter?
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    Review your information and click generate to create your letter
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button
                    onClick={onBack}
                    variant="outlined"
                    sx={{
                      minWidth: 120,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'medium',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 40
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Send />}
                    sx={{
                      minWidth: 160,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'medium',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                      },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 40
                    }}
                  >
                    Generate Letter
                  </Button>
                </Box>
              </Paper>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default LetterRequestForm;