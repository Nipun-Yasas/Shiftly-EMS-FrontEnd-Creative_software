'use client';

import React, { useState } from 'react';
import { Formik, Form } from "formik";
import {
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  useTheme,
  Divider,
  Chip
} from '@mui/material';
import {
  ArrowBack,
  Assignment,
  Work,
  AttachMoney,
  VerifiedUser,
  BusinessCenter,
  Send
} from '@mui/icons-material';

import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import DateInput from "../../../_components/inputs/DateInput";

const LetterRequestForm = ({ letterType, onBack, onGenerate }) => {
  const theme = useTheme();

  const getLetterIcon = (letterTypeName) => {
    switch (letterTypeName) {
      case "EPF/ETF Name Change Letter": return <Assignment />;
      case "Letter for Skill Assessment": return <Work />;
      case "Salary Undertaking Letter": return <AttachMoney />;
      case "Salary Confirmation Letter": return <VerifiedUser />;
      case "Employment Confirmation Letter": return <BusinessCenter />;
      default: return <Assignment />;
    }
  };

  // Define specific fields for each letter type (same logic as before)
  const getLetterTypeFields = (letterTypeName) => {
    switch (letterTypeName) {
      case "EPF/ETF Name Change Letter":
        return {
          fields: [
            { name: "employeeId", label: "Employee ID", type: "text", required: true, section: "Personal Information" },
            { name: "currentName", label: "Current Name", type: "text", required: true, section: "Personal Information" },
            { name: "newName", label: "New Name", type: "text", required: true, section: "Personal Information" },
            { name: "nicNumber", label: "NIC Number", type: "text", required: true, section: "Personal Information" },
            { name: "epfNumber", label: "EPF Number", type: "text", required: true, section: "Fund Details" },
            { name: "etfNumber", label: "ETF Number", type: "text", required: true, section: "Fund Details" },
            { name: "reasonForChange", label: "Reason for Name Change", type: "textarea", required: true, section: "Request Details" },
            { name: "effectiveDate", label: "Effective Date", type: "date", required: true, section: "Request Details" },
          ],
          initialValues: {
            employeeId: "", currentName: "", newName: "", nicNumber: "", 
            epfNumber: "", etfNumber: "", reasonForChange: "", effectiveDate: ""
          }
        };
      
      case "Letter for Skill Assessment":
        return {
          fields: [
            { name: "employeeId", label: "Employee ID", type: "text", required: true, section: "Personal Information" },
            { name: "fullName", label: "Full Name", type: "text", required: true, section: "Personal Information" },
            { name: "position", label: "Current Position", type: "text", required: true, section: "Employment Details" },
            { name: "department", label: "Department", type: "text", required: true, section: "Employment Details" },
            { name: "skillsToAssess", label: "Skills to be Assessed", type: "textarea", required: true, section: "Assessment Details" },
            { name: "assessmentPurpose", label: "Purpose of Assessment", type: "textarea", required: true, section: "Assessment Details" },
          ],
          initialValues: {
            employeeId: "", fullName: "", position: "", department: "", 
            skillsToAssess: "", assessmentPurpose: ""
          }
        };
      
      case "Salary Undertaking Letter":
        return {
          fields: [
            { name: "employeeId", label: "Employee ID", type: "text", required: true, section: "Personal Information" },
            { name: "fullName", label: "Full Name", type: "text", required: true, section: "Personal Information" },
            { name: "position", label: "Position", type: "text", required: true, section: "Employment Details" },
            { name: "currentSalary", label: "Current Salary", type: "text", required: true, section: "Salary Details" },
            { name: "currency", label: "Currency", type: "text", required: true, section: "Salary Details" },
            { name: "salaryFrequency", label: "Salary Frequency", type: "select", required: true, section: "Salary Details", options: ["Monthly", "Annual"] },
            { name: "undertakingPurpose", label: "Purpose of Undertaking", type: "textarea", required: true, section: "Request Details" },
          ],
          initialValues: {
            employeeId: "", fullName: "", position: "", currentSalary: "", 
            currency: "LKR", salaryFrequency: "Monthly", undertakingPurpose: ""
          }
        };
      
      case "Salary Confirmation Letter":
        return {
          fields: [
            { name: "employeeId", label: "Employee ID", type: "text", required: true, section: "Personal Information" },
            { name: "fullName", label: "Full Name", type: "text", required: true, section: "Personal Information" },
            { name: "position", label: "Position", type: "text", required: true, section: "Employment Details" },
            { name: "department", label: "Department", type: "text", required: true, section: "Employment Details" },
            { name: "currentSalary", label: "Current Salary", type: "text", required: true, section: "Salary Details" },
            { name: "currency", label: "Currency", type: "text", required: true, section: "Salary Details" },
            { name: "allowances", label: "Allowances (if any)", type: "textarea", required: false, section: "Salary Details" },
            { name: "confirmationPurpose", label: "Purpose of Confirmation", type: "textarea", required: true, section: "Request Details" },
          ],
          initialValues: {
            employeeId: "", fullName: "", position: "", department: "", 
            currentSalary: "", currency: "LKR", allowances: "", confirmationPurpose: ""
          }
        };
      
      case "Employment Confirmation Letter":
        return {
          fields: [
            { name: "employeeId", label: "Employee ID", type: "text", required: true, section: "Personal Information" },
            { name: "fullName", label: "Full Name", type: "text", required: true, section: "Personal Information" },
            { name: "position", label: "Position", type: "text", required: true, section: "Employment Details" },
            { name: "department", label: "Department", type: "text", required: true, section: "Employment Details" },
            { name: "employmentType", label: "Employment Type", type: "select", required: true, section: "Employment Details", options: ["Full-time", "Part-time", "Contract"] },
            { name: "workingHours", label: "Working Hours", type: "text", required: true, section: "Employment Details" },
            { name: "reportingManager", label: "Reporting Manager", type: "text", required: true, section: "Employment Details" },
            { name: "confirmationPurpose", label: "Purpose of Confirmation", type: "textarea", required: true, section: "Request Details" },
          ],
          initialValues: {
            employeeId: "", fullName: "", position: "", department: "", 
            employmentType: "Full-time", workingHours: "", reportingManager: "", confirmationPurpose: ""
          }
        };
      
      default:
        return {
          fields: [],
          initialValues: {}
        };
    }
  };

  const currentLetterConfig = getLetterTypeFields(letterType);

  // Group fields by section
  const groupedFields = currentLetterConfig.fields.reduce((groups, field) => {
    const section = field.section || 'General Information';
    if (!groups[section]) {
      groups[section] = [];
    }
    groups[section].push(field);
    return groups;
  }, {});

  // Render input field based on type
  const renderField = (field) => {
    const baseProps = {
      name: field.name,
      label: field.label,
      key: field.name,
    };

    switch (field.type) {
      case 'date':
        return (
          <InputItem key={field.name}>
            <DateInput {...baseProps} />
          </InputItem>
        );
      case 'textarea':
        return (
          <InputItem key={field.name}>
            <TextInput 
              {...baseProps}
              multiline
              rows={3}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
            />
          </InputItem>
        );
      case 'select':
        return (
          <InputItem key={field.name}>
            <SelectInput
              {...baseProps}
              options={field.options?.map(opt => ({ id: opt, name: opt })) || []}
              getOptionLabel={(option) => option.name || ""}
            />
          </InputItem>
        );
      case 'text':
      default:
        return (
          <InputItem key={field.name}>
            <TextInput 
              {...baseProps}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
            />
          </InputItem>
        );
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={onBack}
            sx={{
              mr: 2,
              color: theme.palette.text.primary,
              '&:hover': { backgroundColor: `${theme.palette.primary.main}20` }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${theme.palette.primary.main}20`,
              color: theme.palette.primary.main,
              mr: 2
            }}
          >
            {getLetterIcon(letterType)}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.text.primary,
                fontFamily: 'var(--font-poppins)'
              }}
            >
              {letterType}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
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
          
          // Validate required fields
          currentLetterConfig.fields.forEach(field => {
            if (field.required && (!values[field.name] || values[field.name].toString().trim() === '')) {
              errors[field.name] = `${field.label} is required`;
            }
          });
          
          return errors;
        }}
        onSubmit={(values) => {
          console.log('Letter generation data:', values);
          onGenerate({ letterType, formData: values });
        }}
      >
        {({ validateForm, values, isValid }) => (
          <Form>
            <Stack spacing={3}>
              {Object.entries(groupedFields).map(([sectionName, fields]) => (
                <Card
                  key={sectionName}
                  elevation={1}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          color: theme.palette.text.primary,
                          mr: 2
                        }}
                      >
                        {sectionName}
                      </Typography>
                      <Chip
                        label={`${fields.length} field${fields.length !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{
                          backgroundColor: `${theme.palette.primary.main}15`,
                          color: theme.palette.primary.main
                        }}
                      />
                    </Box>
                    
                    <Stack spacing={2}>
                      {fields.map((field) => (
                        <Box key={field.name}>
                          {renderField(field)}
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              ))}

              {/* Submit Section */}
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.text.primary,
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

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    onClick={onBack}
                    variant="outlined"
                    sx={{
                      minWidth: 120,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'medium'
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Send />}
                    sx={{
                      minWidth: 120,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'medium',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                      }
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
